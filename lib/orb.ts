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

/** The canvas is drawn this much larger than the medal's box (and the camera pulled back to match), so the
 * tilted, wobbling medal and its orbit rings are never clipped. Must match styles/home-orb.css. */
const SPREAD = 1.7;
const TAU = Math.PI * 2;

/**
 * Mounts the interactive medal: a thin metal disc textured with the seal artwork, lit by a soft studio
 * environment. Drag to turn it; fling it and it keeps flipping like a tossed coin, wobbling as it spins, then
 * settles face front the short way round. The faint orbit rings show up while it spins, and on a mouse it leans
 * toward the pointer. The five orbit-ring images behind it tilt and turn with it.
 * Arrow keys turn it, Home resets. Reduced motion keeps only the plain turn-and-return.
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
  let destroyed = false;
  let drag: { x: number; y: number; id: number; t: number } | null = null;

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    listeners.abort();
    signal.removeEventListener('abort', destroy);
    cancelAnimationFrame(renderFrame);
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

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);
    camera.position.z = 4.1 * SPREAD;
    const tilt = new THREE.Group(); // leans toward the pointer
    const medal = new THREE.Group(); // spins when dragged or flung
    const rings = new THREE.Group(); // faint orbit lines that appear while spinning
    tilt.add(medal);
    scene.add(tilt, rings);

    const ringMaterial = track(
      new THREE.LineBasicMaterial({ color: 0x9a0002, transparent: true, opacity: 0, depthWrite: false }),
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

    // ------------------------------------------------------------ motion state
    const velocity = { x: 0, y: 0 }; // rad/s after a fling
    const dragSpeed = { x: 0, y: 0 }; // smoothed rad/s while dragging
    const lean = { x: 0, y: 0, tx: 0, ty: 0 }; // pointer lean, current and target
    let energy = 0; // 0 at rest, ~1 for a hard spin: drives the orbital show
    let settling = false;
    let orbitSpin = 0; // extra turn of the orbit images behind
    let lastTick = 0;
    let clock = 0;

    const draw = (dt: number) => {
      clock += dt;
      const calm = reduced.matches;
      const e = Math.min(1.4, energy);
      // the medal wobbles (precesses) a little while energised
      medal.rotation.z = calm ? 0 : 0.11 * Math.min(1, e) * Math.sin(clock * 6.5);
      tilt.rotation.set(lean.x, lean.y, 0);
      rings.rotation.set(0.8 * medal.rotation.x, -(0.8 * medal.rotation.y), 0.2 * medal.rotation.y + clock * 0.3 * e);
      // the orbit rings show while it is turned or spinning
      const turned = Math.max(0, Math.hypot(Math.sin(medal.rotation.x), Math.sin(medal.rotation.y)) - 0.2);
      ringMaterial.opacity = calm ? 0 : Math.min(0.5, 0.35 * turned + 0.4 * e);

      try {
        renderer?.render(scene, camera);
      } catch {
        destroy();
        return;
      }
      // the orbit images behind turn while it spins, then ease back to where they were
      orbitSpin += dt * 0.6 * e;
      if (e < 0.25) orbitSpin *= Math.exp(-dt * 1.5);
      if (Math.abs(orbitSpin) < 0.0005) orbitSpin = 0;
      orbits.forEach((el, i) => {
        const strength = (0.55 + 0.2 * i) * (i % 2 ? -1 : 1);
        const rx = calm ? 0 : Math.sin(medal.rotation.x + lean.x) * strength;
        const ry = calm ? 0 : Math.sin(medal.rotation.y + lean.y) * strength;
        const rz = calm ? 0 : orbitSpin * (i % 2 ? -1 : 1) * (0.4 + 0.15 * i);
        el.style.transform = `translate(-50%,-50%) perspective(1100px) rotateX(${rx}rad) rotateY(${ry}rad) rotateZ(${rz}rad)${ORBIT_SUFFIX[i] ?? ''}`;
      });
      root.dataset.ready = 'true'; // CSS swaps the static stamp for the live canvas
      stage.tabIndex = 0;
      stamps.forEach((el) => el.setAttribute('aria-hidden', 'true'));
    };

    // One loop for everything; it stops by itself when nothing is moving, so an idle medal costs nothing.
    const busy = () =>
      !!drag ||
      settling ||
      energy > 0.003 ||
      orbitSpin !== 0 ||
      Math.abs(lean.x - lean.tx) + Math.abs(lean.y - lean.ty) > 0.0005;
    const tick = (time: number) => {
      renderFrame = 0;
      if (destroyed || document.hidden) return;
      const dt = Math.min((time - lastTick) / 1000 || 1 / 60, 1 / 30);
      lastTick = time;
      step(dt);
      draw(dt);
      if (busy()) renderFrame = requestAnimationFrame(tick);
      else lastTick = 0;
    };
    const render = () => {
      if (destroyed || renderFrame || document.hidden) return;
      renderFrame = requestAnimationFrame(tick);
    };

    // Dark mode swaps in the dark artwork (and hides the plain edge colour).
    const applyTheme = () => {
      const dark = document.documentElement.dataset.researchTheme === 'dark';
      faces.forEach((m) => (m.map = dark ? darkTexture : lightTexture));
      backEdge.colorWrite = !dark;
      ringMaterial.color.setHex(dark ? 0xefe6de : 0xc4585a);
      render();
    };
    themeWatcher = new MutationObserver(applyTheme);
    themeWatcher.observe(document.documentElement, { attributeFilter: ['data-research-theme'] });
    applyTheme();
    resize = new ResizeObserver(() => {
      const size = Math.round(stage.clientWidth * SPREAD);
      renderer?.setSize(size, size, false);
      render();
    });
    resize.observe(stage);

    // ------------------------------------------------------------ physics
    const stopSettling = () => {
      settling = false;
      velocity.x = velocity.y = 0;
    };
    const reset = () => {
      stopSettling();
      energy = 0;
      medal.rotation.set(0, 0, 0);
      render();
    };
    /** Per frame: the fling's free spin, then a spring to the nearest face-front turn; energy follows speed. */
    const step = (dt: number) => {
      let speed = 0;
      if (settling) {
        let moving = 0;
        for (const axis of ['x', 'y'] as const) {
          const target = Math.round(medal.rotation[axis] / TAU) * TAU; // face front, the short way round
          const fast = Math.abs(velocity[axis]) / 4;
          const soft = 1 / (1 + fast * fast); // a fast spin is barely held back; a slow one snaps home
          velocity[axis] += (-(1.5 + 60 * soft) * (medal.rotation[axis] - target) - (2.2 + 11 * soft) * velocity[axis]) * dt;
          medal.rotation[axis] += velocity[axis] * dt;
          moving += Math.abs(medal.rotation[axis] - target) + Math.abs(velocity[axis]);
        }
        speed = Math.hypot(velocity.x, velocity.y);
        if (moving < 0.002) {
          settling = false;
          medal.rotation.x = medal.rotation.y = 0; // a whole number of turns: the same pose
        }
      } else if (drag) speed = Math.hypot(dragSpeed.x, dragSpeed.y);
      const target = Math.min(1.4, speed / 9);
      energy += (target - energy) * Math.min(1, dt * (target > energy ? 10 : 3.5));
      if (energy < 0.003 && !drag && !settling) energy = 0;
      lean.x += (lean.tx - lean.x) * Math.min(1, dt * 7);
      lean.y += (lean.ty - lean.y) * Math.min(1, dt * 7);
    };
    const release = () => {
      if (!drag) return;
      const id = drag.id;
      drag = null;
      if (stage.hasPointerCapture(id)) stage.releasePointerCapture(id);
      if (reduced.matches || document.hidden) {
        for (const axis of ['x', 'y'] as const)
          medal.rotation[axis] = Math.atan2(Math.sin(medal.rotation[axis]), Math.cos(medal.rotation[axis]));
        velocity.x = velocity.y = 0;
        settling = true; // the plain spring back, no fling
        render();
        return;
      }
      // fling: keep the drag's speed (capped) and let the medal fly
      velocity.x = Math.max(-22, Math.min(22, dragSpeed.x));
      velocity.y = Math.max(-22, Math.min(22, dragSpeed.y));
      settling = true;
      render();
    };

    const opts = { signal: listeners.signal };
    stage.addEventListener(
      'pointerdown',
      (e) => {
        if (e.button !== 0 || drag) return;
        stopSettling();
        dragSpeed.x = dragSpeed.y = 0;
        drag = { x: e.clientX, y: e.clientY, id: e.pointerId, t: e.timeStamp };
        stage.setPointerCapture(e.pointerId);
        // no focus() here: it left the keyboard focus ring drawn round the medal after every drag
        // (keyboard users still Tab to it, and get the ring)
      },
      opts,
    );
    stage.addEventListener(
      'pointermove',
      (e) => {
        if (!drag || drag.id !== e.pointerId) return;
        if (e.buttons === 0) return release();
        const dy = (e.clientX - drag.x) * 0.012;
        const dx = (e.clientY - drag.y) * 0.008;
        medal.rotation.y += dy;
        medal.rotation.x += dx;
        // smoothed angular speed (rad/s), which becomes the fling on release
        const dt = Math.max(0.004, (e.timeStamp - drag.t) / 1000);
        dragSpeed.x += (dx / dt - dragSpeed.x) * 0.5;
        dragSpeed.y += (dy / dt - dragSpeed.y) * 0.5;
        drag.x = e.clientX;
        drag.y = e.clientY;
        drag.t = e.timeStamp;
        render();
      },
      opts,
    );
    // a drag that stops before letting go is not a fling
    const stillTimer = { id: 0 };
    stage.addEventListener(
      'pointermove',
      () => {
        clearTimeout(stillTimer.id);
        stillTimer.id = window.setTimeout(() => drag && ((dragSpeed.x = 0), (dragSpeed.y = 0)), 90);
      },
      opts,
    );
    // on a mouse, the medal leans toward the pointer
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
    stage.addEventListener(
      'pointermove',
      (e) => {
        if (!finePointer.matches || reduced.matches || drag) return;
        const box = stage.getBoundingClientRect();
        lean.ty = ((e.clientX - box.left) / box.width - 0.5) * 0.9;
        lean.tx = ((e.clientY - box.top) / box.height - 0.5) * 0.7;
        render();
      },
      opts,
    );
    stage.addEventListener(
      'pointerleave',
      () => {
        lean.tx = lean.ty = 0;
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
