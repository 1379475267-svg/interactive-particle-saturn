import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.querySelector("#scene");
const fullscreenBtn = document.querySelector("#fullscreenBtn");
const statusText = document.querySelector("#statusText");
const statusDot = document.querySelector("#statusDot");
const readoutScale = document.querySelector("#readoutScale");
const readoutBrightness = document.querySelector("#readoutBrightness");
const readoutChaos = document.querySelector("#readoutChaos");
const readoutMode = document.querySelector("#readoutMode");

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.45;

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02050a, 0.033);

const camera = new THREE.PerspectiveCamera(
  38,
  window.innerWidth / window.innerHeight,
  0.1,
  200,
);
camera.position.set(0, 2.4, 18.5);

const clock = new THREE.Clock();
const saturnSystem = new THREE.Group();
scene.add(saturnSystem);

const coreGroup = new THREE.Group();
const ringGroup = new THREE.Group();
saturnSystem.add(coreGroup, ringGroup);

const ambient = new THREE.AmbientLight(0xbddcff, 0.6);
scene.add(ambient);

const rimLight = new THREE.PointLight(0xfff2d3, 8, 120, 2);
rimLight.position.set(0, 0, 10);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0x6ea8ff, 3.6, 120, 2);
fillLight.position.set(-18, 10, 12);
scene.add(fillLight);

const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount; i += 1) {
  const radius = 40 + Math.random() * 90;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
  const idx = i * 3;
  starPositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
  starPositions[idx + 1] = radius * Math.cos(phi) * 0.45;
  starPositions[idx + 2] = radius * Math.sin(phi) * Math.sin(theta);
}
starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
const stars = new THREE.Points(
  starGeometry,
  new THREE.PointsMaterial({
    size: 0.16,
    color: 0xc8dcff,
    transparent: true,
    opacity: 0.85,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  }),
);
scene.add(stars);

const baseSaturnColor = new THREE.Color(0xf8d49a);
const ringColor = new THREE.Color(0xffe0b8);
const chaosColor = new THREE.Color(0xdaf1ff);

const coreCount = 22000;
const corePositions = new Float32Array(coreCount * 3);
const coreSizes = new Float32Array(coreCount);
const coreSeeds = new Float32Array(coreCount * 4);
for (let i = 0; i < coreCount; i += 1) {
  const idx = i * 3;
  const u = Math.random();
  const v = Math.random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const radius = 1.7 + Math.pow(Math.random(), 2.8) * 2.2;
  corePositions[idx] = radius * Math.sin(phi) * Math.cos(theta);
  corePositions[idx + 1] = radius * Math.cos(phi);
  corePositions[idx + 2] = radius * Math.sin(phi) * Math.sin(theta);
  coreSizes[i] = Math.random();
  coreSeeds[i * 4] = Math.random() * Math.PI * 2;
  coreSeeds[i * 4 + 1] = 0.4 + Math.random() * 1.2;
  coreSeeds[i * 4 + 2] = 0.25 + Math.random() * 1.45;
  coreSeeds[i * 4 + 3] = 0.2 + Math.random() * 0.8;
}

const coreGeometry = new THREE.BufferGeometry();
coreGeometry.setAttribute("position", new THREE.BufferAttribute(corePositions, 3));
coreGeometry.setAttribute("aSize", new THREE.BufferAttribute(coreSizes, 1));

const coreMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uPixelRatio: { value: renderer.getPixelRatio() },
    uTime: { value: 0 },
    uScale: { value: 1 },
    uChaos: { value: 0 },
    uBrightness: { value: 1 },
    uColor: { value: baseSaturnColor.clone() },
  },
  vertexShader: `
    attribute float aSize;
    uniform float uPixelRatio;
    uniform float uTime;
    uniform float uScale;
    uniform float uChaos;
    varying float vStrength;

    void main() {
      vec3 displaced = position;
      float pulse = sin(uTime * (0.28 + aSize * 0.36) + position.y * 1.3) * 0.1;
      displaced *= 1.0 + pulse;
      displaced += normalize(position) * uChaos * (0.18 + aSize * 0.2) * sin(uTime * 5.4 + position.x * 2.0);

      vec4 mvPosition = modelViewMatrix * vec4(displaced * uScale, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (4.0 + 6.0 * aSize) * uPixelRatio / max(1.0, -mvPosition.z * 0.09);
      vStrength = 0.55 + aSize * 0.6;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    uniform float uBrightness;
    varying float vStrength;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      float alpha = smoothstep(0.5, 0.0, dist);
      alpha *= 0.75 + vStrength * 0.45;
      vec3 color = uColor * uBrightness * (1.0 + alpha * 0.6);
      gl_FragColor = vec4(color, alpha);
    }
  `,
});

const corePoints = new THREE.Points(coreGeometry, coreMaterial);
coreGroup.add(corePoints);

const ringCount = 18000;
const ringPositions = new Float32Array(ringCount * 3);
const ringSizes = new Float32Array(ringCount);
const ringColors = new Float32Array(ringCount * 3);
const ringState = [];

for (let i = 0; i < ringCount; i += 1) {
  const a = THREE.MathUtils.lerp(4.8, 11.8, Math.pow(Math.random(), 0.72));
  const e = THREE.MathUtils.lerp(0.02, 0.22, Math.pow(Math.random(), 1.6));
  const inc = THREE.MathUtils.randFloatSpread(0.22);
  const node = Math.random() * Math.PI * 2;
  const periapsis = Math.random() * Math.PI * 2;
  const meanAnomaly = Math.random() * Math.PI * 2;
  const baseSpeed = THREE.MathUtils.lerp(0.45, 0.9, Math.random());
  const thickness = THREE.MathUtils.randFloatSpread(0.18);
  const idx = i * 3;

  ringState.push({
    a,
    e,
    inc,
    node,
    periapsis,
    meanAnomaly,
    baseSpeed,
    thickness,
    noisePhase: Math.random() * Math.PI * 2,
    burstBias: 0.35 + Math.random() * 0.65,
  });

  ringPositions[idx] = a;
  ringPositions[idx + 1] = thickness;
  ringPositions[idx + 2] = 0;
  ringSizes[i] = Math.random();

  const hueMix = Math.random();
  const color = ringColor.clone().lerp(chaosColor, Math.pow(hueMix, 5) * 0.65);
  ringColors[idx] = color.r;
  ringColors[idx + 1] = color.g;
  ringColors[idx + 2] = color.b;
}

const ringGeometry = new THREE.BufferGeometry();
ringGeometry.setAttribute("position", new THREE.BufferAttribute(ringPositions, 3));
ringGeometry.setAttribute("aSize", new THREE.BufferAttribute(ringSizes, 1));
ringGeometry.setAttribute("color", new THREE.BufferAttribute(ringColors, 3));

const ringMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uPixelRatio: { value: renderer.getPixelRatio() },
    uBrightness: { value: 1 },
  },
  vertexShader: `
    attribute float aSize;
    varying vec3 vColor;
    uniform float uPixelRatio;
    uniform float uBrightness;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (2.2 + aSize * 6.8 * uBrightness) * uPixelRatio / max(1.0, -mvPosition.z * 0.1);
      vColor = color;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      float alpha = smoothstep(0.5, 0.0, dist);
      gl_FragColor = vec4(vColor * (1.0 + alpha * 0.6), alpha);
    }
  `,
});

const ringPoints = new THREE.Points(ringGeometry, ringMaterial);
ringGroup.add(ringPoints);
ringGroup.rotation.x = THREE.MathUtils.degToRad(67);
ringGroup.rotation.z = THREE.MathUtils.degToRad(14);

const aura = new THREE.Mesh(
  new THREE.SphereGeometry(3.9, 64, 64),
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(0xfde5ba) },
      uBrightness: { value: 0.55 },
    },
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uBrightness;
      varying vec3 vNormal;

      void main() {
        float fresnel = pow(1.0 - abs(vNormal.z), 2.6);
        gl_FragColor = vec4(uColor * uBrightness * 1.3, fresnel * 0.48);
      }
    `,
  }),
);
coreGroup.add(aura);

const state = {
  openness: 0.16,
  opennessTarget: 0.16,
  confidence: 0,
  scale: 0.88,
  scaleTarget: 0.88,
  brightness: 0.6,
  chaos: 0,
  burst: 0,
  intro: 0,
};

let pointerActive = false;
let lastPointerY = 0;
let pointerRotationY = 0;
let pointerRotationX = 0.22;

function setStatus(text, live = false) {
  statusText.textContent = text;
  statusDot.classList.toggle("live", live);
}

function solveKepler(meanAnomaly, eccentricity) {
  let eccentricAnomaly = meanAnomaly;
  for (let i = 0; i < 4; i += 1) {
    eccentricAnomaly -=
      (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(eccentricAnomaly));
  }
  return eccentricAnomaly;
}

function orbitPoint(params, time, chaos) {
  const meanMotion = params.baseSpeed / Math.pow(params.a, 1.5);
  const meanAnomaly = params.meanAnomaly + time * meanMotion;
  const eccentricAnomaly = solveKepler(meanAnomaly, params.e);
  const cosE = Math.cos(eccentricAnomaly);
  const sinE = Math.sin(eccentricAnomaly);

  const x = params.a * (cosE - params.e);
  const z = params.a * Math.sqrt(1 - params.e * params.e) * sinE;
  const radius = Math.max(0.001, Math.sqrt(x * x + z * z));
  const trueAnomaly = Math.atan2(z, x);

  const cosNode = Math.cos(params.node);
  const sinNode = Math.sin(params.node);
  const cosI = Math.cos(params.inc);
  const sinI = Math.sin(params.inc);
  const arg = trueAnomaly + params.periapsis;
  const cosArg = Math.cos(arg);
  const sinArg = Math.sin(arg);

  const px = radius * (cosNode * cosArg - sinNode * sinArg * cosI);
  const py = radius * sinArg * sinI + params.thickness;
  const pz = radius * (sinNode * cosArg + cosNode * sinArg * cosI);

  const position = new THREE.Vector3(px, py, pz);
  if (chaos <= 0.001) {
    return position;
  }

  const radial = position.clone().normalize();
  const swirl = new THREE.Vector3(
    Math.sin(time * 17.0 + params.noisePhase),
    Math.cos(time * 21.0 + params.noisePhase * 0.7),
    Math.sin(time * 26.0 + params.noisePhase * 1.4),
  ).multiplyScalar(0.16 + chaos * 1.85);

  const burst = radial.multiplyScalar(chaos * chaos * params.a * params.burstBias * 1.3);
  return position.add(swirl).add(burst);
}

function updateRing(time) {
  const positionAttr = ringGeometry.getAttribute("position");
  const positions = positionAttr.array;
  const scale = state.scale;
  const chaos = state.chaos;

  for (let i = 0; i < ringCount; i += 1) {
    const idx = i * 3;
    const point = orbitPoint(ringState[i], time, chaos);
    positions[idx] = point.x * scale;
    positions[idx + 1] = point.y * scale;
    positions[idx + 2] = point.z * scale;
  }

  positionAttr.needsUpdate = true;
}

function updateCore(time) {
  const positionAttr = coreGeometry.getAttribute("position");
  const positions = positionAttr.array;

  for (let i = 0; i < coreCount; i += 1) {
    const idx = i * 3;
    const seedOffset = i * 4;
    const ox = corePositions[idx];
    const oy = corePositions[idx + 1];
    const oz = corePositions[idx + 2];
    const radius = Math.sqrt(ox * ox + oy * oy + oz * oz) || 1;
    const nx = ox / radius;
    const ny = oy / radius;
    const nz = oz / radius;

    const scalePulse =
      1 +
      Math.sin(time * coreSeeds[seedOffset + 1] + coreSeeds[seedOffset]) * 0.08 +
      Math.cos(time * coreSeeds[seedOffset + 2] + oy * 0.8) * 0.05;

    const chaosOffset =
      state.chaos *
      (0.18 + coreSeeds[seedOffset + 3] * 0.85) *
      (1 + 0.7 * Math.sin(time * 18 + coreSeeds[seedOffset]));

    const burstOffset = state.burst * state.burst * 2.6 * (0.3 + coreSizes[i] * 0.7);

    positions[idx] = (ox * scalePulse + nx * (chaosOffset + burstOffset)) * state.scale;
    positions[idx + 1] = (oy * scalePulse + ny * (chaosOffset + burstOffset)) * state.scale;
    positions[idx + 2] = (oz * scalePulse + nz * (chaosOffset + burstOffset)) * state.scale;
  }

  positionAttr.needsUpdate = true;
}

function updateVisualState(time, delta) {
  state.intro = THREE.MathUtils.damp(state.intro, 1, 0.85, delta);
  state.scaleTarget = THREE.MathUtils.lerp(0.76, 3.95, state.openness);
  state.scale = THREE.MathUtils.damp(state.scale, state.scaleTarget, 3.8, delta);
  state.brightness = THREE.MathUtils.lerp(0.34, 1.18, Math.pow(state.scale / 3.95, 0.92));
  state.chaos = THREE.MathUtils.smoothstep(state.scale, 2.8, 3.95);
  state.burst = THREE.MathUtils.smoothstep(state.scale, 3.3, 3.95);

  saturnSystem.rotation.y += 0.0008 + state.scale * 0.0004;
  saturnSystem.rotation.z = Math.sin(time * 0.12) * 0.03;
  saturnSystem.position.y = THREE.MathUtils.lerp(1.4, 0, state.intro);
  saturnSystem.scale.setScalar(THREE.MathUtils.lerp(0.9, 1, state.intro));

  coreMaterial.uniforms.uTime.value = time;
  coreMaterial.uniforms.uScale.value = 1;
  coreMaterial.uniforms.uChaos.value = state.chaos;
  coreMaterial.uniforms.uBrightness.value = state.brightness;

  const blendedCoreColor = baseSaturnColor.clone().lerp(chaosColor, state.chaos * 0.35);
  coreMaterial.uniforms.uColor.value.copy(blendedCoreColor);
  ringMaterial.uniforms.uBrightness.value = THREE.MathUtils.lerp(0.75, 1.5, state.brightness);
  aura.material.uniforms.uBrightness.value = THREE.MathUtils.lerp(0.18, 1.2, state.brightness);

  rimLight.intensity = THREE.MathUtils.lerp(3.1, 13.5, state.brightness);
  fillLight.intensity = THREE.MathUtils.lerp(1.8, 5.2, state.brightness);
  renderer.toneMappingExposure = THREE.MathUtils.lerp(0.95, 1.72, state.brightness);

  const cameraTargetZ = THREE.MathUtils.lerp(20, 11.5, state.scale / 3.95);
  camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTargetZ, 1.8, delta);
  camera.position.y = THREE.MathUtils.damp(camera.position.y, 2.4, 1.1, delta);
}

function updatePointerControl(delta) {
  state.openness = THREE.MathUtils.damp(state.openness, state.opennessTarget, 6, delta);
  saturnSystem.rotation.x = THREE.MathUtils.damp(
    saturnSystem.rotation.x,
    pointerRotationX,
    3.6,
    delta,
  );
  saturnSystem.rotation.y = THREE.MathUtils.damp(
    saturnSystem.rotation.y,
    pointerRotationY + clock.elapsedTime * 0.08,
    2.8,
    delta,
  );
}

function updateReadout() {
  readoutScale.textContent = state.scale.toFixed(2);
  readoutBrightness.textContent = state.brightness.toFixed(2);
  readoutChaos.textContent = state.chaos.toFixed(2);

  let mode = "Stable";
  if (state.chaos > 0.65) {
    mode = "Burst";
  } else if (state.chaos > 0.15) {
    mode = "Transition";
  }

  readoutMode.textContent = mode;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  coreMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  ringMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
}

fullscreenBtn.addEventListener("click", async () => {
  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen();
    fullscreenBtn.textContent = "Exit Fullscreen";
    return;
  }
  await document.exitFullscreen();
  fullscreenBtn.textContent = "Fullscreen";
});

document.addEventListener("fullscreenchange", () => {
  fullscreenBtn.textContent = document.fullscreenElement
    ? "Exit Fullscreen"
    : "Fullscreen";
});

window.addEventListener("resize", onResize);

renderer.domElement.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const deltaDirection = THREE.MathUtils.clamp(-event.deltaY * 0.0012, -0.18, 0.18);
    state.opennessTarget = THREE.MathUtils.clamp(
      state.opennessTarget + deltaDirection,
      0,
      1,
    );
    setStatus(
      `Mouse wheel control. Openness ${(state.opennessTarget * 100).toFixed(0)}%`,
      true,
    );
  },
  { passive: false },
);

renderer.domElement.addEventListener("pointerdown", (event) => {
  pointerActive = true;
  lastPointerY = event.clientY;
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  if (!pointerActive) {
    return;
  }

  const deltaY = lastPointerY - event.clientY;
  lastPointerY = event.clientY;
  state.opennessTarget = THREE.MathUtils.clamp(
    state.opennessTarget + deltaY * 0.0015,
    0,
    1,
  );
  pointerRotationY += event.movementX * 0.0035;
  pointerRotationX = THREE.MathUtils.clamp(
    pointerRotationX + event.movementY * 0.0015,
    -0.55,
    0.55,
  );
  setStatus(
    `Pointer control active. Openness ${(state.opennessTarget * 100).toFixed(0)}%`,
    true,
  );
});

renderer.domElement.addEventListener("pointerup", (event) => {
  pointerActive = false;
  renderer.domElement.releasePointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointerleave", () => {
  pointerActive = false;
});

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  updatePointerControl(delta);
  updateVisualState(elapsed, delta);
  updateCore(elapsed);
  updateRing(elapsed);
  updateReadout();
  renderer.render(scene, camera);
}

setStatus("Mouse wheel or vertical drag controls Saturn.", true);
animate();
