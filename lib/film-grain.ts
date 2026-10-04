import * as THREE from 'three';

/**
 * A static layer of fine speckle over the whole window, drawn once (and again on resize). Each pixel
 * is either lit or not according to a hash of its position, so the pattern never repeats and costs
 * nothing per frame. The canvas it draws on is faded to 2% by CSS, which only warms the page slightly.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec2 uRes;
  uniform float uDpr, uSize, uDensity, uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  void main() {
    float n = hash(floor(vUv * uRes / (uSize * uDpr)));
    gl_FragColor = vec4(uColor, step(1.0 - uDensity, n)) * uOpacity;
  }
`;

/** Draws the grain onto `canvas`; returns a function that removes it, or undefined without WebGL. */
export function mountFilmGrain(canvas: HTMLCanvasElement): (() => void) | undefined {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, canvas, premultipliedAlpha: false });
  } catch {
    return undefined;
  }
  renderer.setClearColor(0, 0);
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new THREE.PlaneGeometry(2, 2);
  const color = new THREE.Color('#eaeaea');
  const material = new THREE.ShaderMaterial({
    fragmentShader: FRAGMENT,
    vertexShader: VERTEX,
    transparent: true,
    uniforms: {
      uColor: { value: new THREE.Vector3(color.r, color.g, color.b) },
      uDensity: { value: 0.25 }, // fraction of pixels that are lit
      uDpr: { value: 1 },
      uOpacity: { value: 1 },
      uRes: { value: new THREE.Vector2() },
      uSize: { value: 1 }, // grain size in CSS pixels
    },
  });
  scene.add(new THREE.Mesh(geometry, material));

  const draw = () => {
    const ratio = Math.min(devicePixelRatio, 2);
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(ratio);
    material.uniforms.uRes.value.set(innerWidth * ratio, innerHeight * ratio);
    material.uniforms.uDpr.value = ratio;
    renderer.render(scene, camera);
  };
  draw();
  addEventListener('resize', draw);
  return () => {
    removeEventListener('resize', draw);
    material.dispose();
    geometry.dispose();
    renderer.dispose();
  };
}
