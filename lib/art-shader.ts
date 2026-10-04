import * as THREE from 'three';
import { subscribeAmbientMotion } from './ambient-motion';

/**
 * A moving layer over the footer picture. The canvas sits exactly on top of the still and redraws it
 * with a little life: wisps of white matter drift down from the hand, and the sparkles in the image fall
 * and twinkle. The orb and its halo are left untouched. Everything is computed in a fragment shader from
 * the still itself, so there is no video or extra art to load.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/** Helpers shared by the effect: cover-fit sampling, luma, hash and value noise. */
const COMMON = /* glsl */ `
  precision highp float;
  uniform sampler2D uTex;
  uniform vec2 uTexRes, uRes;
  uniform float uTime;
  varying vec2 vUv;

  // object-fit: cover, anchored top-center.
  vec2 coverUv(vec2 uv) {
    float s = max(uRes.x / uTexRes.x, uRes.y / uTexRes.y);
    vec2 disp = uTexRes * s;
    vec2 frag = uv * uRes;
    vec2 offset = vec2((uRes.x - disp.x) * 0.5, uRes.y - disp.y);
    return (frag - offset) / disp;
  }

  float luma(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  // Value noise, 4 taps. Cheap enough to layer three octaves at 60.
  float vnoise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm3(vec2 p) {
    return vnoise(p) * 0.5 + vnoise(p * 2.03 + 7.1) * 0.25 + vnoise(p * 4.07 + 3.3) * 0.125;
  }
`;

/** The footer's effect. */
const FOOTER_EFFECT = /* glsl */ `
  // The DOM's fade over the still (SiteFooter), as image fractions from the
  // TOP. This canvas sits above that gradient and applies the same ramp so
  // the moving picture fades into the same ink at the same rows.
  const vec2 FADE = vec2(441.3 / 848.0, 1.0);
  const vec3 INK = vec3(154.0 / 255.0, 0.0, 2.0 / 255.0);
  // The art's own layout, as a fraction of its height from the TOP: the orb
  // is the bright mass above this line, the hand the one below, with dark
  // sky between (measured on the asset). Nothing sheds above it.
  const float HAND_TOP = 0.42;

  float lumaAt(vec2 uv) { return luma(texture2D(uTex, uv).rgb); }
  float handAt(float l) { return smoothstep(0.4, 0.8, l); }
  // mean luma 40 px out in the four directions: high = the orb or the hand's body
  float aroundAt(vec2 uv, vec2 px) {
    return 0.25 * (lumaAt(uv + vec2(px.x * 40.0, 0.0)) + lumaAt(uv - vec2(px.x * 40.0, 0.0))
                 + lumaAt(uv + vec2(0.0, px.y * 40.0)) + lumaAt(uv - vec2(0.0, px.y * 40.0)));
  }

  // ridged fbm: sharp bright seams, the shape of torn cloud
  float ridged(vec2 q) {
    float a = 1.0 - abs(vnoise(q) * 2.0 - 1.0);
    a += (1.0 - abs(vnoise(q * 2.1 + 5.0) * 2.0 - 1.0)) * 0.5;
    a += (1.0 - abs(vnoise(q * 4.3 + 9.0) * 2.0 - 1.0)) * 0.25;
    return a / 1.75;
  }

  void main() {
    vec2 uv = coverUv(vUv);
    vec2 px = 1.0 / uTexRes;
    vec3 art = texture2D(uTex, uv).rgb;
    float l = luma(art);
    float aspect = uRes.x / uRes.y;
    vec2 p = vec2(uv.x * aspect, uv.y);
    float t = uTime * 0.2;

    float around = aroundAt(uv, px);
    float orb = smoothstep(0.8, 0.95, min(l, around));
    float halo = smoothstep(0.55, 0.8, around);
    float hand = handAt(l) * (1.0 - orb);

    vec3 col = art;

    // shed — white matter detached from the hand, falling. Three lanes at
    // different reach so wisps of different lengths coexist. Only in the
    // hand's half of the picture: a wisp's source must sit below HAND_TOP,
    // so the orb (and its halo, bright but not flat) never feeds one.
    vec3 shed = vec3(0.0);
    float shedA = 0.0;
    for (int i = 0; i < 3; i++) {
      float fi = float(i);
      float reach = 0.07 + fi * 0.065;
      vec2 curl = vec2(fbm3(p * 2.4 + fi * 7.0 + vec2(t, t * 0.4)) - 0.5, 1.0);
      vec2 from = uv + curl * vec2(0.6, 1.0) * reach;            // the hand matter above this pixel
      float inHandHalf = smoothstep(HAND_TOP, HAND_TOP + 0.04, 1.0 - from.y);
      float src = handAt(lumaAt(from)) * inHandHalf;
      float w = ridged(p * (4.0 + fi * 1.5) + vec2(t * 0.2 + fi * 3.0, t * (1.4 + fi * 0.3)));
      float a = src * smoothstep(0.46, 0.84, w) * (1.0 - fi * 0.2);
      shed += texture2D(uTex, from).rgb * a;
      shedA += a;
    }
    shedA = min(shedA, 1.0);
    shed = shedA > 0.0 ? shed / max(shedA, 1e-4) : shed;
    col = max(col, mix(col, shed, shedA * (1.0 - hand) * 0.95));

    // speck — the image's sparkles fall down their column and twinkle.
    // Each column has its own cycle: a sparkle that sits at row Y in the
    // still is shown at Y - fall, where fall runs from 0 to the column's
    // reach and then that sparkle begins again from its seat. Columns are
    // out of phase and have different speeds and reaches, so no reset is
    // visible anywhere at once, and the picture never tiles.
    float colId = floor(uv.x * uTexRes.x / 6.0);
    float speed = 0.018 + hash(vec2(colId, 3.0)) * 0.042;
    float reach = 0.25 + hash(vec2(colId, 5.0)) * 0.35;           // how far a sparkle falls before it is gone
    float cyc = uTime * speed / reach + hash(vec2(colId, 11.0));  // this column's cycle, offset by phase
    float fall = fract(cyc) * reach;
    vec2 above = uv + vec2(0.0, fall);
    float la = lumaAt(above) * step(above.y, 1.0);
    float ma = 0.25 * (lumaAt(above + vec2(px.x * 6.0, 0.0)) + lumaAt(above - vec2(px.x * 6.0, 0.0))
                     + lumaAt(above + vec2(0.0, px.y * 6.0)) + lumaAt(above - vec2(0.0, px.y * 6.0)));
    float speck = smoothstep(0.6, 0.9, la) * smoothstep(0.1, 0.3, la - ma);
    // a sparkle, not a piece of the hand or the orb it is passing
    speck *= 1.0 - smoothstep(0.35, 0.6, aroundAt(above, px));
    // fade in from the seat and out at the end of the reach, so the cycle's
    // seam is invisible
    speck *= smoothstep(0.0, 0.08, fall / reach) * (1.0 - smoothstep(0.7, 1.0, fall / reach));
    float phase = hash(vec2(colId, floor(above.y * uTexRes.y / 6.0))) * 6.2832;
    float tw = 0.5 + 0.5 * pow(0.5 + 0.5 * sin(uTime * (1.5 + hash(vec2(colId, 7.0)) * 3.0) + phase), 2.0);
    col = max(col, mix(col, texture2D(uTex, above).rgb, speck * tw * (1.0 - hand)));

    // the orb and its halo hold: their pixels are the still's, in COLOUR —
    // never by lowering alpha, which would blend a moved picture over the
    // still and darken it
    col = mix(col, art, max(orb, halo));

    // uv.y is bottom-up; the fade is top-down
    float fromTop = 1.0 - uv.y;
    float ink = clamp((fromTop - FADE.x) / (FADE.y - FADE.x), 0.0, 1.0);
    gl_FragColor = vec4(mix(col, INK, ink), 1.0);
  }
`;

/**
 * Starts the effect on `canvas` using the picture at `src`. Returns a function that stops it and
 * frees the GPU resources, or to undefined when WebGL is unavailable.
 */
export function mountArtShader(canvas: HTMLCanvasElement, src: string): (() => void) | undefined {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      canvas,
      powerPreference: 'low-power',
      premultipliedAlpha: false,
    });
  } catch {
    return undefined; // no WebGL: the still picture underneath is all there is
  }
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setClearColor(0, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const texture = new THREE.Texture();
  const material = new THREE.ShaderMaterial({
    blending: THREE.NormalBlending,
    depthTest: false,
    depthWrite: false,
    transparent: true,
    fragmentShader: COMMON + FOOTER_EFFECT,
    vertexShader: VERTEX,
    uniforms: {
      uRes: { value: new THREE.Vector2(1, 1) },
      uTex: { value: texture },
      uTexRes: { value: new THREE.Vector2(1, 1) },
      uTime: { value: 0 },
    },
  });
  scene.add(new THREE.Mesh(geometry, material));

  let ready = false; // picture decoded and shader compiled
  let onScreen = false;
  let awake = false; // the page is being interacted with
  let disposed = false;
  let frame = 0;
  let lastTime: number | undefined;
  let elapsed = 0;
  let bitmap: ImageBitmap | undefined;

  const draw = () => ready && renderer.render(scene, camera);
  const resize = () => {
    const ratio = Math.min(devicePixelRatio, 2);
    renderer.setPixelRatio(ratio);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    material.uniforms.uRes.value.set(canvas.clientWidth * ratio, canvas.clientHeight * ratio);
    draw();
  };

  // Animate only while it is ready, visible and someone is around; otherwise stop the loop and the clock.
  const syncLoop = () => {
    if (ready && onScreen && awake && !disposed) frame ||= requestAnimationFrame(tick);
    else {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = undefined;
    }
  };
  const tick = (now: number) => {
    frame = 0;
    if (!(ready && onScreen && awake && !disposed)) return;
    if (lastTime !== undefined) elapsed += Math.max(0, now - lastTime) / 1000;
    lastTime = now;
    material.uniforms.uTime.value = elapsed;
    draw();
    syncLoop();
  };

  const loader = new THREE.ImageBitmapLoader().setOptions({
    imageOrientation: 'flipY',
    premultiplyAlpha: 'none',
  });
  loader
    .loadAsync(src)
    .then(async (image) => {
      if (disposed) return image.close();
      bitmap = image;
      texture.image = image;
      texture.needsUpdate = true;
      texture.colorSpace = THREE.NoColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      material.uniforms.uTexRes.value.set(image.width, image.height);
      renderer.initTexture(texture);
      await renderer.compileAsync(scene, camera);
      if (disposed) return;
      ready = true;
      draw();
      syncLoop();
    })
    .catch((error) => !disposed && console.warn('[art-shader] could not prepare', src, error));

  const stopAmbient = subscribeAmbientMotion((active) => {
    awake = active;
    syncLoop();
  });
  const visibility = new IntersectionObserver((entries) => {
    onScreen = entries.at(-1)?.isIntersecting ?? false;
    syncLoop();
  });
  const resizes = new ResizeObserver(resize);
  resize();
  resizes.observe(canvas);
  visibility.observe(canvas);

  return () => {
    disposed = true;
    stopAmbient();
    visibility.disconnect();
    resizes.disconnect();
    cancelAnimationFrame(frame);
    loader.abort();
    texture.dispose();
    bitmap?.close();
    material.dispose();
    geometry.dispose();
    renderer.dispose();
  };
}
