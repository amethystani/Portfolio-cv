import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { neuronRecords, type NeuronRecord } from './neurons';

/**
 * The 3D scatter of neurons in the "Neuron steering" article. Each neuron is a small sphere placed by
 * layer (x), delta (y) and neuron index (z) inside a wireframe box; positive deltas and negative deltas
 * are drawn in two colours. Drag to orbit; the page-level controls zoom and reset.
 */

export type Constellation = {
  records: NeuronRecord[];
  /** Plots exactly these neurons. */
  show: (records: NeuronRecord[]) => void;
  /** Back to the starting camera. */
  reset: () => void;
  /** Move the camera towards (< 1) or away from (> 1) the middle. */
  zoom: (factor: number) => void;
  dispose: () => void;
};

const HOME = new THREE.Vector3(5.8, 4.3, 6.6);
const BOX = 4;
const KEY_ROTATE = 0.12;

/** A text label that always faces the camera. */
function label(
  scene: THREE.Scene,
  own: Array<{ dispose: () => void }>,
  text: string,
  color: THREE.Color,
  x: number,
  y: number,
  z: number,
) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Neuron labels unavailable');
  ctx.fillStyle = color.getStyle();
  ctx.font = '26px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(text, 256, 40);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false });
  own.push(texture, material);
  const sprite = new THREE.Sprite(material);
  sprite.position.set(x, y, z);
  sprite.scale.set(3.2, 0.4, 1);
  scene.add(sprite);
}

/**
 * Builds the scene inside `host`.
 * @param onHover called with a neuron's rank when the pointer rests on it
 * @param onLost called if the browser takes the WebGL context away
 */
export function mountConstellation(
  host: HTMLElement,
  onHover: (rank: number) => void,
  onLost: () => void,
): Constellation {
  const own: Array<{ dispose: () => void }> = []; // everything to free on dispose
  const abort = new AbortController();
  let disposed = false;
  let frame = 0;
  let renderer: THREE.WebGLRenderer | undefined;
  let controls: OrbitControls | undefined;
  let resizes: ResizeObserver | undefined;

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    abort.abort();
    resizes?.disconnect();
    controls?.dispose();
    own.reverse().forEach((item) => item.dispose());
    renderer?.dispose();
    renderer?.forceContextLoss();
    renderer?.domElement.remove();
  };

  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.domElement.setAttribute('aria-hidden', 'true');
    host.append(renderer.domElement);
    const gl = renderer;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    controls = new OrbitControls(camera, gl.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = false;
    controls.minPolarAngle = 0.15;
    controls.maxPolarAngle = Math.PI - 0.15;
    const orbit = controls;

    // Colours come from the page's own theme so the scene follows light and dark.
    const style = getComputedStyle(host);
    const link = new THREE.Color(style.getPropertyValue('--nw-editorial-link').trim());
    const text = new THREE.Color(style.getPropertyValue('--nw-editorial-text').trim());
    const paper = new THREE.Color(style.getPropertyValue('--nw-editorial-paper').trim());
    const muted = text
      .clone()
      .convertLinearToSRGB()
      .lerp(paper.clone().convertLinearToSRGB(), 0.46)
      .convertSRGBToLinear();

    // Draw on demand: once per animation frame at most, and only when something changed.
    const draw = () => {
      if (disposed || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!disposed) gl.render(scene, camera);
      });
    };

    // The frame: a floor grid and a wireframe cube.
    const grid = new THREE.GridHelper(BOX, 8, text, link);
    own.push(grid.geometry, grid.material as THREE.Material);
    grid.position.y = -2;
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.12;
    scene.add(grid);
    const cube = new THREE.BoxGeometry(BOX, BOX, BOX);
    const edges = new THREE.EdgesGeometry(cube);
    const edgeMaterial = new THREE.LineBasicMaterial({ color: text, transparent: true, opacity: 0.2 });
    own.push(cube, edges, edgeMaterial);
    scene.add(new THREE.LineSegments(edges, edgeMaterial));

    label(scene, own, 'LAYER 0 - 31', text, 0, -2.35, 2.15);
    label(scene, own, 'NEURON 0 - 14336', text, 2.4, -2.2, 0);
    label(scene, own, 'DELTA -4 - +4', text, -2.1, 2.25, 0);

    // The neurons: two instanced meshes (positive, negative) sharing one sphere.
    const cloud = new THREE.Group();
    scene.add(cloud);
    const sphere = new THREE.SphereGeometry(1, 12, 8);
    own.push(sphere);
    const meshes = [
      new THREE.MeshBasicMaterial({ color: link }),
      new THREE.MeshBasicMaterial({ color: muted }),
    ].map((material) => {
      own.push(material);
      const mesh = new THREE.InstancedMesh(sphere, material, neuronRecords.length);
      own.push(mesh);
      mesh.count = 0;
      cloud.add(mesh);
      return mesh;
    });
    const shown = new Map<THREE.InstancedMesh, NeuronRecord[]>();
    const placer = new THREE.Object3D();

    const reset = () => {
      if (disposed) return;
      camera.position.copy(HOME);
      orbit.target.set(0, 0, 0);
      orbit.update();
      draw();
    };
    const zoom = (factor: number) => {
      if (disposed) return;
      camera.position.sub(orbit.target).multiplyScalar(factor).clampLength(4, 16).add(orbit.target);
      orbit.update();
      draw();
    };

    // Keyboard: arrows rotate, + / - zoom, Home resets.
    host.addEventListener(
      'keydown',
      (e) => {
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
          e.preventDefault();
          const spherical = new THREE.Spherical().setFromVector3(camera.position.clone().sub(orbit.target));
          if (e.key === 'ArrowLeft') spherical.theta -= KEY_ROTATE;
          if (e.key === 'ArrowRight') spherical.theta += KEY_ROTATE;
          if (e.key === 'ArrowUp') spherical.phi -= KEY_ROTATE;
          if (e.key === 'ArrowDown') spherical.phi += KEY_ROTATE;
          spherical.phi = THREE.MathUtils.clamp(spherical.phi, orbit.minPolarAngle, orbit.maxPolarAngle);
          camera.position.setFromSpherical(spherical).add(orbit.target);
          orbit.update();
          draw();
        } else if (e.key === '+' || e.key === '=' || e.key === '-') {
          e.preventDefault();
          zoom(e.key === '-' ? 1.15 : 0.85);
        } else if (e.key === 'Home') {
          e.preventDefault();
          reset();
        }
      },
      { signal: abort.signal },
    );

    // Hovering a neuron reports its rank.
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    gl.domElement.addEventListener(
      'pointermove',
      (e) => {
        if (e.buttons) return; // dragging, not hovering
        const box = gl.domElement.getBoundingClientRect();
        if (!box.width || !box.height) return;
        pointer.set(
          ((e.clientX - box.left) / box.width) * 2 - 1,
          (-(e.clientY - box.top) / box.height) * 2 + 1,
        );
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(cloud.children, false)[0];
        const record =
          hit?.instanceId !== undefined
            ? shown.get(hit.object as THREE.InstancedMesh)?.[hit.instanceId]
            : undefined;
        if (record) onHover(record.rank);
      },
      { signal: abort.signal },
    );
    gl.domElement.addEventListener(
      'webglcontextlost',
      () => {
        dispose();
        onLost();
      },
      { signal: abort.signal },
    );
    orbit.addEventListener('change', draw);
    abort.signal.addEventListener('abort', () => orbit.removeEventListener('change', draw), { once: true });

    const resize = () => {
      if (disposed) return;
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      gl.setSize(width, height);
      draw();
    };
    resizes = new ResizeObserver(resize);
    resizes.observe(host);
    reset();
    resize();

    return {
      records: neuronRecords,
      show: (records) => {
        if (disposed) return;
        meshes.forEach((mesh, i) => {
          const subset = records.filter((r) => r.delta > 0 === (i === 0)); // mesh 0 = positive, 1 = negative
          shown.set(mesh, subset);
          mesh.count = subset.length;
          subset.forEach((r, n) => {
            placer.position.set((r.layer / 31) * BOX - 2, (r.delta / 4) * 2, (r.neuron / 14336) * BOX - 2);
            placer.scale.setScalar(0.025 + (r.abs_delta / 4) * 0.065); // bigger = stronger
            placer.updateMatrix();
            mesh.setMatrixAt(n, placer.matrix);
          });
          mesh.instanceMatrix.needsUpdate = true;
          mesh.computeBoundingSphere();
        });
        draw();
      },
      reset,
      zoom,
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
