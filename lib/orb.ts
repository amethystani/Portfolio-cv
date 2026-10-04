import * as THREE from 'three';

/** Extra CSS transforms for the five decorative orbit rings (same order as the .nw-orb-layer elements). */
const ORBIT_SUFFIX = [
  '',
  '',
  ' rotate(-90deg)',
  ' rotate(46.28deg) skewX(2.56deg)',
  ' rotate(-46.28deg) skewX(-2.56deg)',
];

const PHYSICAL = { iridescenceIOR: 1.3, iridescenceThicknessRange: [180, 400] as [number, number] };

/**
 * Mounts the interactive "Nous girl medal": a thin metal disc textured with the seal artwork, lit by a soft
 * studio environment, that you can drag to spin (it springs back) or turn with the arrow keys. The five
 * orbit-ring images behind it tilt with the medal.
 *
 * `root` is the .nw-orb-sigil element containing the stamp <img>s and the .nw-orb-stage placeholder.
 * Returns a function that tears everything down.
 */
export async function mountOrbSigil(
  root: HTMLElement,
  signal: AbortSignal,
): Promise<(() => void) | undefined> {
  const stampLight = root.querySelector<HTMLImageElement>('[data-stamp="light"]');
  const stampDark = root.querySelector<HTMLImageElement>('[data-stamp="dark"]');
  const stage = root.querySelector<HTMLElement>('.nw-orb-stage');
  if (!stampLight || !stampDark || !stage || signal.aborted) return;

  const stamps = [stampLight, stampDark];
  const orbits = [...root.querySelectorAll<HTMLElement>('.nw-orb-layer')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController(); // everything added below uses this signal
  const disposables: Array<{ dispose(): void }> = [];
  const track = <T extends { dispose(): void }>(item: T) => (disposables.push(item), item);

  let renderer: THREE.WebGLRenderer | undefined;
  let resize: ResizeObserver | undefined;
  let themeWatcher: MutationObserver | undefined;
  let visibility: IntersectionObserver | undefined;
  let renderFrame = 0;
  let settleFrame = 0;
  let destroyed = false;
  let drag: { x: number; y: number; id: number } | null = null;

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    listeners.abort();
    signal.removeEventListener('abort', destroy);
    cancelAnimationFrame(renderFrame);
    cancelAnimationFrame(settleFrame);
    resize?.disconnect();
    themeWatcher?.disconnect();
    visibility?.disconnect();
    if (drag && stage.hasPointerCapture(drag.id)) stage.releasePointerCapture(drag.id);
    drag = null;
    [...disposables].reverse().forEach((d) => d.dispose());
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
    root.removeAttribute('data-ready');
    stage.tabIndex = -1;
    stamps.forEach((el) => el.removeAttribute('aria-hidden'));
    orbits.forEach((el) => el.style.removeProperty('transform'));
  };
  signal.addEventListener('abort', destroy, { once: true });

  try {
    const loadTexture = (img: HTMLImageElement) => {
      const texture = track(new THREE.Texture());
      texture.colorSpace = THREE.SRGBColorSpace;
      return new Promise<THREE.Texture>((resolve, reject) => {
        new THREE.ImageLoader().load(
          img.src,
          (image) => {
            if (!destroyed) {
              texture.image = image;
              texture.needsUpdate = true;
            }
            resolve(texture);
          },
          undefined,
          reject,
        );
      });
    };
    const [lightTexture, darkTexture] = await Promise.all([loadTexture(stampLight), loadTexture(stampDark)]);
    if (destroyed) return destroy;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

    // A small studio of three coloured panels, baked into an environment map for reflections.
    const scene = new THREE.Scene();
    const studio = new THREE.Scene();
    studio.background = new THREE.Color(0xe9dfd5);
    for (const { x, y, z, w, h, color } of [
      { x: -3, y: 3, z: 4, w: 3, h: 5, color: 0xffffff },
      { x: 4, y: 1, z: 2, w: 2, h: 4, color: 0xf7e4d2 },
      { x: 0, y: -3, z: -3, w: 4, h: 2, color: 0xf2d4cc },
    ]) {
      const panel = new THREE.Mesh(
        track(new THREE.PlaneGeometry(w, h)),
        track(new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide })),
      );
      panel.position.set(x, y, z);
      panel.lookAt(0, 0, 0);
      studio.add(panel);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    try {
      scene.environment = track(pmrem.fromScene(studio, 0.05)).texture;
    } finally {
      pmrem.dispose();
    }

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 30);
    camera.position.z = 4.1;
    const medal = new THREE.Group(); // spins when dragged
    const rings = new THREE.Group(); // faint orbit lines that appear while spinning
    scene.add(medal, rings);

    const ringMaterial = track(
      new THREE.LineBasicMaterial({ color: 0xc4585a, transparent: true, opacity: 0, depthWrite: false }),
    );
    for (let i = 0; i < 4; i++) {
      const points = Array.from(
        { length: 128 },
        (_, k) =>
          new THREE.Vector3(1.08 * Math.cos((k * Math.PI) / 64), 1.08 * Math.sin((k * Math.PI) / 64), 0),
      );
      const ring = new THREE.LineLoop(track(new THREE.BufferGeometry().setFromPoints(points)), ringMaterial);
      ring.rotation.set(i % 2 ? Math.PI / 2 : 0, (i * Math.PI) / 4, 0);
      rings.add(ring);
    }

    // The disc itself, then a printed face and a thin metal rim on each side.
    const edge = track(
      new THREE.MeshPhysicalMaterial({
        color: 0xf2f2f2,
        roughness: 0.19,
        metalness: 0.72,
        iridescence: 0.45,
        clearcoat: 0.6,
        ...PHYSICAL,
      }),
    );
    const backEdge = track(edge.clone());
    const disc = new THREE.Mesh(track(new THREE.CylinderGeometry(1, 1, 0.09, 96)), [
      edge,
      backEdge,
      backEdge,
    ]);
    disc.rotation.x = Math.PI / 2;
    medal.add(disc);

    const faces: THREE.MeshPhysicalMaterial[] = [];
    for (const side of [1, -1]) {
      const material = track(
        new THREE.MeshPhysicalMaterial({
          map: lightTexture,
          transparent: true,
          roughness: 0.24,
          metalness: 0.3,
          iridescence: 0.35,
          clearcoat: 0.8,
          clearcoatRoughness: 0.16,
          depthWrite: false,
          ...PHYSICAL,
        }),
      );
      faces.push(material);
      const face = new THREE.Mesh(track(new THREE.CircleGeometry(0.998, 96)), material);
      face.position.z = 0.047 * side;
      if (side < 0) face.rotation.y = Math.PI;
      medal.add(face);
      const rim = new THREE.Mesh(
        track(new THREE.TorusGeometry(1, 0.006, 8, 96)),
        track(new THREE.MeshStandardMaterial({ color: 0xece2d8, metalness: 0.95, roughness: 0.18 })),
      );
      rim.position.z = 0.047 * side;
      medal.add(rim);
    }

    scene.add(new THREE.HemisphereLight(0xffffff, 0x4a1215, 2));
    const key = new THREE.DirectionalLight(0xffffff, 3);
    key.position.set(-2, 3, 4);
    const fill = new THREE.DirectionalLight(0xe89a98, 1.5);
    fill.position.set(3, -1, -2);
    scene.add(key, fill);
    stage.append(renderer.domElement);

    // ------------------------------------------------------------ drawing
    const render = () => {
      if (destroyed || renderFrame || document.hidden) return;
      renderFrame = requestAnimationFrame(() => {
        renderFrame = 0;
        rings.rotation.set(0.8 * medal.rotation.x, -(0.8 * medal.rotation.y), 0.2 * medal.rotation.y);
        ringMaterial.opacity = reduced.matches
          ? 0
          : Math.min(0.45, 0.35 * Math.max(0, Math.hypot(medal.rotation.x, medal.rotation.y) - 0.25));
        try {
          renderer?.render(scene, camera);
        } catch {
          destroy();
          return;
        }
        orbits.forEach((el, i) => {
          const strength = (0.55 + 0.2 * i) * (i % 2 ? -1 : 1);
          const rx = reduced.matches ? 0 : Math.sin(medal.rotation.x) * strength;
          const ry = reduced.matches ? 0 : Math.sin(medal.rotation.y) * strength;
          el.style.transform = `translate(-50%,-50%) perspective(1100px) rotateX(${rx}rad) rotateY(${ry}rad)${ORBIT_SUFFIX[i] ?? ''}`;
        });
        root.dataset.ready = 'true'; // CSS swaps the static stamp for the live canvas
        stage.tabIndex = 0;
        stamps.forEach((el) => el.setAttribute('aria-hidden', 'true'));
      });
    };

    // Dark mode swaps in the dark artwork (and hides the plain edge colour).
    const applyTheme = () => {
      const dark = document.documentElement.dataset.researchTheme === 'dark';
      faces.forEach((m) => (m.map = dark ? darkTexture : lightTexture));
      backEdge.colorWrite = !dark;
      render();
    };
    themeWatcher = new MutationObserver(applyTheme);
    themeWatcher.observe(document.documentElement, { attributeFilter: ['data-research-theme'] });
    applyTheme();
    resize = new ResizeObserver(() => {
      renderer?.setSize(stage.clientWidth, stage.clientWidth);
      render();
    });
    resize.observe(stage);

    // ------------------------------------------------------------ interaction
    const velocity = { x: 0, y: 0 };
    let lastTime = 0;
    const stopSettling = () => {
      cancelAnimationFrame(settleFrame);
      settleFrame = 0;
      velocity.x = velocity.y = 0;
      lastTime = 0;
    };
    const reset = () => {
      stopSettling();
      medal.rotation.set(0, 0, 0);
      render();
    };
    // After letting go, a damped spring pulls the medal back to face front.
    const settle = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000 || 1 / 60, 1 / 30);
      lastTime = time;
      for (const axis of ['x', 'y'] as const) {
        velocity[axis] += (-65 * medal.rotation[axis] - 12 * velocity[axis]) * dt;
        medal.rotation[axis] += velocity[axis] * dt;
      }
      render();
      if (
        Math.abs(medal.rotation.x) +
          Math.abs(medal.rotation.y) +
          Math.abs(velocity.x) +
          Math.abs(velocity.y) >
        0.001
      )
        settleFrame = requestAnimationFrame(settle);
      else reset();
    };
    const release = () => {
      if (!drag) return;
      const id = drag.id;
      drag = null;
      if (stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
      stopSettling();
      for (const axis of ['x', 'y'] as const)
        medal.rotation[axis] = Math.atan2(Math.sin(medal.rotation[axis]), Math.cos(medal.rotation[axis]));
      if (reduced.matches || document.hidden) reset();
      else settleFrame = requestAnimationFrame(settle);
    };

    const opts = { signal: listeners.signal };
    stage.addEventListener(
      'pointerdown',
      (e) => {
        if (e.button !== 0 || drag) return;
        stopSettling();
        drag = { x: e.clientX, y: e.clientY, id: e.pointerId };
        stage.setPointerCapture(e.pointerId);
        stage.focus({ preventScroll: true });
      },
      opts,
    );
    stage.addEventListener(
      'pointermove',
      (e) => {
        if (!drag || drag.id !== e.pointerId) return;
        if (e.buttons === 0) return release();
        medal.rotation.y += (e.clientX - drag.x) * 0.012;
        medal.rotation.x += (e.clientY - drag.y) * 0.008;
        drag.x = e.clientX;
        drag.y = e.clientY;
        render();
      },
      opts,
    );
    for (const type of ['pointerup', 'pointercancel', 'lostpointercapture'])
      stage.addEventListener(type, release, opts);
    addEventListener('pointerup', release, opts);
    addEventListener('blur', () => (release(), reset()), opts);
    document.addEventListener(
      'visibilitychange',
      () =>
        document.hidden
          ? (release(), reset(), cancelAnimationFrame(renderFrame), (renderFrame = 0))
          : render(),
      opts,
    );
    reduced.addEventListener('change', () => (release(), reset()), opts);
    visibility = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) || (release(), reset()),
    );
    visibility.observe(root);
    stage.addEventListener('dragstart', (e) => e.preventDefault(), opts);
    stage.addEventListener(
      'keydown',
      (e) => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home'].includes(e.key)) return;
        e.preventDefault();
        stopSettling();
        if (e.key === 'Home') reset();
        else {
          if (e.key === 'ArrowLeft' || e.key === 'ArrowRight')
            medal.rotation.y += e.key === 'ArrowLeft' ? -0.15 : 0.15;
          else medal.rotation.x += e.key === 'ArrowUp' ? -0.15 : 0.15;
          render();
        }
      },
      opts,
    );
    renderer.domElement.addEventListener('webglcontextlost', (e) => (e.preventDefault(), destroy()), opts);
    render();
    return destroy;
  } catch (error) {
    destroy();
    throw error;
  }
}
