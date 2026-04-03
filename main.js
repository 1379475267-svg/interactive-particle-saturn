import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.164.1/build/three.module.js";

const canvas = document.querySelector("#scene");
const fullscreenBtn = document.querySelector("#fullscreenBtn");
const infoBtn = document.querySelector("#infoBtn");
const closeInfoBtn = document.querySelector("#closeInfoBtn");
const infoPanel = document.querySelector("#infoPanel");
const cursorGlow = document.querySelector("#cursorGlow");
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

const ambient = new THREE.AmbientLight(0xbddcff, 0.7);
scene.add(ambient);

const rimLight = new THREE.PointLight(0xfff2d3, 8, 120, 2);
rimLight.position.set(0, 0, 10);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0x6ea8ff, 3.6, 120, 2);
fillLight.position.set(-18, 10, 12);
scene.add(fillLight);

const backLight = new THREE.PointLight(0x95d8ff, 2.8, 130, 2);
backLight.position.set(12, -8, -18);
scene.add(backLight);

const starGeometry = new THREE.BufferGeometry();
const starCount = 1400;
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
    uPulse: { value: 0 },
    uColor: { value: baseSaturnColor.clone() },
  },
  vertexShader: `
    attribute float aSize;
    uniform float uPixelRatio;
    uniform float uTime;
    uniform float uScale;
    uniform float uChaos;
    uniform float uPulse;
    varying float vStrength;

    void main() {
      vec3 displaced = position;
      float pulse = sin(uTime * (0.28 + aSize * 0.36) + position.y * 1.3) * 0.1;
      displaced *= 1.0 + pulse + uPulse * 0.06;
      displaced += normalize(position) * uChaos * (0.18 + aSize * 0.2) * sin(uTime * 5.4 + position.x * 2.0);

      vec4 mvPosition = modelViewMatrix * vec4(displaced * uScale, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (4.0 + 6.0 * aSize + uPulse * 4.0) * uPixelRatio / max(1.0, -mvPosition.z * 0.09);
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

const ringTrailPositions = new Float32Array(ringPositions);
const ringTrailGeometry = new THREE.BufferGeometry();
ringTrailGeometry.setAttribute("position", new THREE.BufferAttribute(ringTrailPositions, 3));
ringTrailGeometry.setAttribute("aSize", new THREE.BufferAttribute(ringSizes, 1));
ringTrailGeometry.setAttribute("color", new THREE.BufferAttribute(ringColors, 3));

const ringMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uPixelRatio: { value: renderer.getPixelRatio() },
    uBrightness: { value: 1 },
    uPulse: { value: 0 },
  },
  vertexShader: `
    attribute float aSize;
    varying vec3 vColor;
    uniform float uPixelRatio;
    uniform float uBrightness;
    uniform float uPulse;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (2.2 + aSize * 6.8 * uBrightness + uPulse * 2.6) * uPixelRatio / max(1.0, -mvPosition.z * 0.1);
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

const ringTrailMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uPixelRatio: { value: renderer.getPixelRatio() },
    uBrightness: { value: 1 },
    uPulse: { value: 0 },
  },
  vertexShader: `
    attribute float aSize;
    varying vec3 vColor;
    uniform float uPixelRatio;
    uniform float uBrightness;
    uniform float uPulse;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (5.0 + aSize * 10.0 + uPulse * 4.0) * uPixelRatio / max(1.0, -mvPosition.z * 0.1);
      vColor = color;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      float alpha = smoothstep(0.5, 0.0, dist) * 0.18;
      gl_FragColor = vec4(vColor * 0.8, alpha);
    }
  `,
});

const ringTrailPoints = new THREE.Points(ringTrailGeometry, ringTrailMaterial);
ringGroup.add(ringTrailPoints);

const dustCount = 9000;
const dustPositions = new Float32Array(dustCount * 3);
const dustSizes = new Float32Array(dustCount);
const dustColors = new Float32Array(dustCount * 3);
const dustState = [];

for (let i = 0; i < dustCount; i += 1) {
  const idx = i * 3;
  const radius = THREE.MathUtils.lerp(6.2, 15.8, Math.pow(Math.random(), 0.7));
  const angle = Math.random() * Math.PI * 2;
  const height = THREE.MathUtils.randFloatSpread(0.6);
  dustPositions[idx] = Math.cos(angle) * radius;
  dustPositions[idx + 1] = height;
  dustPositions[idx + 2] = Math.sin(angle) * radius;
  dustSizes[i] = Math.random();
  const color = ringColor.clone().lerp(new THREE.Color(0xfff6df), Math.random() * 0.55);
  dustColors[idx] = color.r;
  dustColors[idx + 1] = color.g;
  dustColors[idx + 2] = color.b;
  dustState.push({
    radius,
    angle,
    height,
    drift: 0.2 + Math.random() * 0.5,
    phase: Math.random() * Math.PI * 2,
  });
}

const dustGeometry = new THREE.BufferGeometry();
dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
dustGeometry.setAttribute("aSize", new THREE.BufferAttribute(dustSizes, 1));
dustGeometry.setAttribute("color", new THREE.BufferAttribute(dustColors, 3));

const dustMaterial = new THREE.ShaderMaterial({
  transparent: true,
  depthWrite: false,
  vertexColors: true,
  blending: THREE.AdditiveBlending,
  uniforms: {
    uPixelRatio: { value: renderer.getPixelRatio() },
    uBrightness: { value: 1 },
    uPulse: { value: 0 },
  },
  vertexShader: `
    attribute float aSize;
    varying vec3 vColor;
    uniform float uPixelRatio;
    uniform float uBrightness;
    uniform float uPulse;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = (3.5 + aSize * 6.0 + uPulse * 1.5) * uPixelRatio / max(1.0, -mvPosition.z * 0.11);
      vColor = color;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      float alpha = smoothstep(0.5, 0.0, dist) * 0.24;
      gl_FragColor = vec4(vColor, alpha);
    }
  `,
});

const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
ringGroup.add(dustPoints);

const shockwave = new THREE.Mesh(
  new THREE.TorusGeometry(8.6, 0.18, 48, 240),
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uPulse: { value: 0 },
      uProgress: { value: 0 },
      uColor: { value: new THREE.Color(0xdff6ff) },
    },
    vertexShader: `
      uniform float uPulse;
      uniform float uProgress;
      varying vec2 vUv;
      varying float vWave;

      void main() {
        vUv = uv;
        vec3 transformed = position;
        float wave = sin(uv.x * 10.0 + uProgress * 14.0) * 0.06 * (0.3 + uPulse);
        transformed += normal * (uProgress * 1.8 + wave);
        vWave = wave;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform float uPulse;
      uniform float uProgress;
      varying vec2 vUv;
      varying float vWave;

      void main() {
        float band = smoothstep(0.18, 0.48, uProgress) * (1.0 - smoothstep(0.72, 1.0, uProgress));
        float rim = pow(1.0 - abs(vUv.y - 0.5) * 2.0, 2.0);
        float alpha = band * rim * (0.18 + uPulse * 0.45) + abs(vWave) * 0.6;
        gl_FragColor = vec4(uColor * (0.7 + uPulse * 0.8), alpha);
      }
    `,
  }),
);
shockwave.rotation.x = Math.PI / 2;
shockwave.visible = false;
ringGroup.add(shockwave);
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
  scale: 0.88,
  scaleTarget: 0.88,
  brightness: 0.6,
  chaos: 0,
  burst: 0,
  intro: 0,
  pulse: 0,
  pulseTarget: 0,
  infoOpen: false,
  orbitSpin: 0,
  shockwave: 0,
  shockwaveActive: false,
};

const pointer = {
  active: false,
  lastY: 0,
  normX: 0,
  normY: 0,
  rotX: 0.22,
  rotY: 0,
};

function setStatus(text, live = false) {
  statusText.textContent = text;
  statusDot.classList.toggle("live", live);
}

function setInfoOpen(nextOpen) {
  state.infoOpen = nextOpen;
  infoPanel.classList.toggle("open", nextOpen);
  infoPanel.setAttribute("aria-hidden", String(!nextOpen));
  infoBtn.textContent = nextOpen ? "Hide Info" : "Info";
}

function triggerBurst(intensity = 1) {
  state.pulseTarget = Math.max(state.pulseTarget, intensity);
  state.opennessTarget = THREE.MathUtils.clamp(state.opennessTarget + 0.24 * intensity, 0, 1);
  state.shockwave = 0.001;
  state.shockwaveActive = true;
  shockwave.visible = true;
  setStatus("Energy burst triggered.", true);
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

function orbitPoint(params, time, chaos, pulse) {
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
  if (chaos <= 0.001 && pulse <= 0.001) {
    return position;
  }

  const radial = position.clone().normalize();
  const swirl = new THREE.Vector3(
    Math.sin(time * (17 + pulse * 8) + params.noisePhase),
    Math.cos(time * (21 + pulse * 6) + params.noisePhase * 0.7),
    Math.sin(time * (26 + pulse * 9) + params.noisePhase * 1.4),
  ).multiplyScalar(0.16 + chaos * 1.85 + pulse * 0.65);

  const burst = radial.multiplyScalar(
    chaos * chaos * params.a * params.burstBias * 1.3 + pulse * params.a * 0.2,
  );
  return position.add(swirl).add(burst);
}

function updateRing(time) {
  const positionAttr = ringGeometry.getAttribute("position");
  const positions = positionAttr.array;
  const trailAttr = ringTrailGeometry.getAttribute("position");
  const trailPositions = trailAttr.array;
  const scale = state.scale;

  for (let i = 0; i < ringCount; i += 1) {
    const idx = i * 3;
    const point = orbitPoint(ringState[i], time, state.chaos, state.pulse);
    positions[idx] = point.x * scale;
    positions[idx + 1] = point.y * scale;
    positions[idx + 2] = point.z * scale;

    trailPositions[idx] = THREE.MathUtils.lerp(trailPositions[idx], positions[idx], 0.11);
    trailPositions[idx + 1] = THREE.MathUtils.lerp(trailPositions[idx + 1], positions[idx + 1], 0.11);
    trailPositions[idx + 2] = THREE.MathUtils.lerp(trailPositions[idx + 2], positions[idx + 2], 0.11);
  }

  positionAttr.needsUpdate = true;
  trailAttr.needsUpdate = true;
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

    const burstOffset =
      state.burst * state.burst * 2.6 * (0.3 + coreSizes[i] * 0.7) +
      state.pulse * 0.9 * (0.4 + coreSizes[i] * 0.6);

    positions[idx] = (ox * scalePulse + nx * (chaosOffset + burstOffset)) * state.scale;
    positions[idx + 1] = (oy * scalePulse + ny * (chaosOffset + burstOffset)) * state.scale;
    positions[idx + 2] = (oz * scalePulse + nz * (chaosOffset + burstOffset)) * state.scale;
  }

  positionAttr.needsUpdate = true;
}

function updateDust(time) {
  const positionAttr = dustGeometry.getAttribute("position");
  const positions = positionAttr.array;
  const scale = state.scale;

  for (let i = 0; i < dustCount; i += 1) {
    const idx = i * 3;
    const particle = dustState[i];
    const angle = particle.angle + time * particle.drift * (1 + state.pulse * 0.2);
    const radius =
      particle.radius +
      Math.sin(time * 0.7 + particle.phase) * 0.18 +
      state.chaos * Math.sin(time * 3.4 + particle.phase) * 0.45;
    const height =
      particle.height +
      Math.cos(time * 0.9 + particle.phase * 0.5) * 0.08 +
      state.pulse * Math.sin(time * 5.1 + particle.phase) * 0.12;

    positions[idx] = Math.cos(angle) * radius * scale;
    positions[idx + 1] = height * scale;
    positions[idx + 2] = Math.sin(angle) * radius * scale;
  }

  positionAttr.needsUpdate = true;
}

function updateVisualState(time, delta) {
  state.intro = THREE.MathUtils.damp(state.intro, 1, 0.85, delta);
  state.pulse = THREE.MathUtils.damp(state.pulse, state.pulseTarget, 5.5, delta);
  state.pulseTarget = THREE.MathUtils.damp(state.pulseTarget, 0, 2.8, delta);
  state.scaleTarget = THREE.MathUtils.lerp(0.76, 3.95, state.openness);
  state.scale = THREE.MathUtils.damp(state.scale, state.scaleTarget, 3.8, delta);
  state.brightness = THREE.MathUtils.lerp(0.34, 1.18, Math.pow(state.scale / 3.95, 0.92));
  state.chaos = THREE.MathUtils.smoothstep(state.scale, 2.8, 3.95);
  state.burst = THREE.MathUtils.smoothstep(state.scale, 3.3, 3.95);
  if (state.shockwaveActive) {
    state.shockwave = Math.min(1.1, state.shockwave + delta * (1.35 + state.pulse * 0.5));
    if (state.shockwave >= 1.05) {
      state.shockwaveActive = false;
      shockwave.visible = false;
    }
  }

  state.orbitSpin += delta * (0.22 + state.scale * 0.08);
  saturnSystem.rotation.y = pointer.rotY + state.orbitSpin;
  saturnSystem.rotation.z = Math.sin(time * 0.12) * 0.03 + pointer.normX * 0.04;
  saturnSystem.position.y = THREE.MathUtils.lerp(1.4, 0, state.intro) + pointer.normY * 0.24;
  saturnSystem.position.x = THREE.MathUtils.damp(saturnSystem.position.x, pointer.normX * 0.42, 2.1, delta);
  saturnSystem.scale.setScalar(THREE.MathUtils.lerp(0.9, 1 + state.pulse * 0.04, state.intro));

  coreMaterial.uniforms.uTime.value = time;
  coreMaterial.uniforms.uScale.value = 1;
  coreMaterial.uniforms.uChaos.value = state.chaos;
  coreMaterial.uniforms.uBrightness.value = state.brightness;
  coreMaterial.uniforms.uPulse.value = state.pulse;

  const blendedCoreColor = baseSaturnColor
    .clone()
    .lerp(chaosColor, state.chaos * 0.35 + state.pulse * 0.18);
  coreMaterial.uniforms.uColor.value.copy(blendedCoreColor);
  ringMaterial.uniforms.uBrightness.value = THREE.MathUtils.lerp(0.75, 1.5, state.brightness);
  ringMaterial.uniforms.uPulse.value = state.pulse;
  ringTrailMaterial.uniforms.uBrightness.value = ringMaterial.uniforms.uBrightness.value;
  ringTrailMaterial.uniforms.uPulse.value = state.pulse;
  dustMaterial.uniforms.uBrightness.value = THREE.MathUtils.lerp(0.8, 1.35, state.brightness);
  dustMaterial.uniforms.uPulse.value = state.pulse;
  aura.material.uniforms.uBrightness.value = THREE.MathUtils.lerp(0.18, 1.2, state.brightness + state.pulse * 0.18);
  shockwave.material.uniforms.uTime.value = time;
  shockwave.material.uniforms.uPulse.value = state.pulse;
  shockwave.material.uniforms.uProgress.value = state.shockwaveActive ? state.shockwave : 0;

  rimLight.intensity = THREE.MathUtils.lerp(3.1, 13.5, state.brightness) + state.pulse * 5.6;
  fillLight.intensity = THREE.MathUtils.lerp(1.8, 5.2, state.brightness) + state.pulse * 1.4;
  backLight.intensity = 2.8 + state.chaos * 2.4 + state.pulse * 1.8;
  ambient.intensity = 0.62 + state.pulse * 0.16;
  rimLight.color.copy(new THREE.Color(0xfff2d3).lerp(new THREE.Color(0xfff8ea), state.pulse * 0.5));
  fillLight.color.copy(new THREE.Color(0x6ea8ff).lerp(new THREE.Color(0x8de0ff), state.pulse * 0.7));
  backLight.color.copy(new THREE.Color(0x95d8ff).lerp(new THREE.Color(0xbff5ff), state.pulse * 0.7));
  rimLight.position.x = pointer.normX * 8;
  rimLight.position.y = -pointer.normY * 5;
  fillLight.position.x = -18 + pointer.normX * -5;
  fillLight.position.y = 10 + pointer.normY * 4;
  renderer.toneMappingExposure =
    THREE.MathUtils.lerp(0.95, 1.72, state.brightness) +
    state.pulse * 0.22 +
    Math.max(0, state.pulse - 0.35) * 0.18;

  const cameraBreath = Math.sin(time * 0.42) * 0.24 + Math.sin(time * 0.17) * 0.16;
  const cameraTargetZ = THREE.MathUtils.lerp(20, 11.5, state.scale / 3.95) + cameraBreath;
  camera.position.z = THREE.MathUtils.damp(camera.position.z, cameraTargetZ, 1.8, delta);
  camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.normX * 0.85, 1.8, delta);
  camera.position.y = THREE.MathUtils.damp(
    camera.position.y,
    2.4 - pointer.normY * 0.6 + Math.cos(time * 0.34) * 0.08,
    1.1,
    delta,
  );

  stars.rotation.y += 0.00018;
  stars.rotation.x = pointer.normY * 0.03;
  shockwave.scale.setScalar(0.82 + state.shockwave * 1.95);
}

function updatePointerControl(delta) {
  state.openness = THREE.MathUtils.damp(state.openness, state.opennessTarget, 6, delta);
  saturnSystem.rotation.x = THREE.MathUtils.damp(saturnSystem.rotation.x, pointer.rotX, 3.6, delta);
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
  } else if (state.pulse > 0.18) {
    mode = "Energized";
  }

  readoutMode.textContent = mode;
}

function updateCursorGlow() {
  cursorGlow.style.opacity = "1";
  cursorGlow.style.left = `${((pointer.normX + 1) * 0.5) * window.innerWidth}px`;
  cursorGlow.style.top = `${((1 - (pointer.normY + 1) * 0.5)) * window.innerHeight}px`;
  const scale = 0.85 + state.chaos * 0.45 + state.pulse * 0.35;
  cursorGlow.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  coreMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
  ringMaterial.uniforms.uPixelRatio.value = renderer.getPixelRatio();
}

function updatePointerPosition(clientX, clientY) {
  pointer.normX = THREE.MathUtils.clamp((clientX / window.innerWidth) * 2 - 1, -1, 1);
  pointer.normY = THREE.MathUtils.clamp(-((clientY / window.innerHeight) * 2 - 1), -1, 1);
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
  fullscreenBtn.textContent = document.fullscreenElement ? "Exit Fullscreen" : "Fullscreen";
});

infoBtn.addEventListener("click", () => {
  setInfoOpen(!state.infoOpen);
});

closeInfoBtn.addEventListener("click", () => {
  setInfoOpen(false);
});

window.addEventListener("keydown", (event) => {
  if (event.key.toLowerCase() === "i") {
    setInfoOpen(!state.infoOpen);
  }

  if (event.code === "Space") {
    event.preventDefault();
    triggerBurst(1);
  }
});

window.addEventListener("resize", onResize);

renderer.domElement.addEventListener(
  "wheel",
  (event) => {
    event.preventDefault();
    const deltaDirection = THREE.MathUtils.clamp(-event.deltaY * 0.0012, -0.18, 0.18);
    state.opennessTarget = THREE.MathUtils.clamp(state.opennessTarget + deltaDirection, 0, 1);
    state.pulseTarget = Math.max(state.pulseTarget, Math.abs(deltaDirection) * 0.8);
    setStatus(`Scroll control. Openness ${(state.opennessTarget * 100).toFixed(0)}%`, true);
  },
  { passive: false },
);

renderer.domElement.addEventListener("pointerdown", (event) => {
  pointer.active = true;
  pointer.lastY = event.clientY;
  updatePointerPosition(event.clientX, event.clientY);
  renderer.domElement.setPointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointermove", (event) => {
  updatePointerPosition(event.clientX, event.clientY);

  if (!pointer.active) {
    return;
  }

  const deltaY = pointer.lastY - event.clientY;
  pointer.lastY = event.clientY;
  state.opennessTarget = THREE.MathUtils.clamp(state.opennessTarget + deltaY * 0.0015, 0, 1);
  pointer.rotY += event.movementX * 0.0035;
  pointer.rotX = THREE.MathUtils.clamp(pointer.rotX + event.movementY * 0.0015, -0.55, 0.55);
  state.pulseTarget = Math.max(
    state.pulseTarget,
    Math.min(Math.abs(event.movementX) + Math.abs(event.movementY), 40) * 0.01,
  );
  setStatus(`Drag control. Openness ${(state.opennessTarget * 100).toFixed(0)}%`, true);
});

renderer.domElement.addEventListener("pointerup", (event) => {
  pointer.active = false;
  renderer.domElement.releasePointerCapture(event.pointerId);
});

renderer.domElement.addEventListener("pointerleave", () => {
  pointer.active = false;
});

renderer.domElement.addEventListener("dblclick", () => {
  triggerBurst(1.2);
});

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  updatePointerControl(delta);
  updateVisualState(elapsed, delta);
  updateCore(elapsed);
  updateRing(elapsed);
  updateDust(elapsed);
  updateReadout();
  updateCursorGlow();
  renderer.render(scene, camera);
}

setInfoOpen(false);
setStatus("Scroll, drag, double-click, or press space.", true);
animate();
