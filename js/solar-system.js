const PLANET_DATA = {
  sun: {
    name: 'Sun',
    type: 'G-type main-sequence star',
    facts: 'The Sun contains 99.86% of the solar system\'s mass and fuses hydrogen into helium at its core, releasing the energy that powers life on Earth.'
  },
  mercury: {
    name: 'Mercury',
    type: 'Terrestrial planet',
    facts: 'Mercury is the smallest planet and the closest to the Sun. A day on Mercury lasts about 59 Earth days, while its year is only 88 Earth days.'
  },
  venus: {
    name: 'Venus',
    type: 'Terrestrial planet',
    facts: 'Venus has a thick carbon dioxide atmosphere and surface temperatures hot enough to melt lead. It rotates backwards compared with most planets.'
  },
  earth: {
    name: 'Earth',
    type: 'Terrestrial planet',
    facts: 'Earth is the only known world with stable liquid water on its surface and the only place confirmed to harbor life.'
  },
  mars: {
    name: 'Mars',
    type: 'Terrestrial planet',
    facts: 'Mars is home to Olympus Mons, the largest volcano in the solar system, and evidence suggests it once had rivers and lakes.'
  },
  jupiter: {
    name: 'Jupiter',
    type: 'Gas giant',
    facts: 'Jupiter is the largest planet and its Great Red Spot is a storm larger than Earth that has raged for centuries.'
  },
  saturn: {
    name: 'Saturn',
    type: 'Gas giant',
    facts: 'Saturn is famous for its bright ring system, made mostly of ice and rock particles ranging from dust-sized to house-sized.'
  },
  uranus: {
    name: 'Uranus',
    type: 'Ice giant',
    facts: 'Uranus rotates on its side, likely due to an ancient collision, and has faint rings and 27 known moons.'
  },
  neptune: {
    name: 'Neptune',
    type: 'Ice giant',
    facts: 'Neptune has the strongest winds in the solar system, reaching speeds over 2,000 km/h despite receiving little sunlight.'
  }
};

const OVERVIEW_CAMERA = { position: { x: 0, y: 35, z: 90 }, lookAt: { x: 0, y: 0, z: 0 } };

function sliderToSpeed(value) {
  const normalized = Number(value) / 1000;
  if (normalized <= 0) {
    return 0;
  }
  return Math.pow(normalized, 2.2) * 1000;
}

function formatSpeed(speed) {
  if (speed <= 0) {
    return '0x';
  }
  if (speed < 10) {
    return `${speed.toFixed(1)}x`;
  }
  return `${Math.round(speed)}x`;
}

AFRAME.registerComponent('starfield', {
  schema: {
    count: { type: 'int', default: 2000 },
    radius: { type: 'number', default: 450 }
  },

  init: function () {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(this.data.count * 3);

    for (let i = 0; i < this.data.count; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = this.data.radius * (0.85 + Math.random() * 0.15);
      const index = i * 3;
      positions[index] = radius * Math.sin(phi) * Math.cos(theta);
      positions[index + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[index + 2] = radius * Math.cos(phi);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.35,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.95
    });

    this.points = new THREE.Points(geometry, material);
    this.el.object3D.add(this.points);
  },

  remove: function () {
    if (this.points) {
      this.el.object3D.remove(this.points);
      this.points.geometry.dispose();
      this.points.material.dispose();
    }
  }
});

AFRAME.registerComponent('orbit', {
  schema: {
    radius: { type: 'number', default: 10 },
    speed: { type: 'number', default: 1 },
    inclination: { type: 'number', default: 0 },
    showPath: { type: 'boolean', default: true }
  },

  init: function () {
    this.angle = Math.random() * Math.PI * 2;
    this.el.setAttribute('rotation', `0 0 ${this.data.inclination}`);

    if (this.data.showPath) {
      this.createOrbitPath();
    }
  },

  createOrbitPath: function () {
    const radius = this.data.radius;
    const thickness = Math.max(0.04, radius * 0.003);
    const path = document.createElement('a-ring');
    path.setAttribute('class', 'orbit-path');
    path.setAttribute('radius-inner', radius - thickness);
    path.setAttribute('radius-outer', radius + thickness);
    path.setAttribute('rotation', '-90 0 0');
    path.setAttribute('material', {
      shader: 'flat',
      color: '#5a7a9a',
      opacity: 0.28,
      transparent: true,
      side: 'double'
    });
    this.el.appendChild(path);
  },

  tick: function (_time, delta) {
    const scene = this.el.sceneEl;
    const speedMultiplier = scene.timeScale || 0;
    if (scene.orbitPaused || speedMultiplier <= 0) {
      return;
    }

    this.angle += (delta / 1000) * this.data.speed * speedMultiplier;
    const x = Math.cos(this.angle) * this.data.radius;
    const z = Math.sin(this.angle) * this.data.radius;
    const child = this.el.firstElementChild;
    if (child) {
      child.setAttribute('position', `${x} 0 ${z}`);
    }
  }
});

AFRAME.registerComponent('moon-orbit', {
  schema: {
    radius: { type: 'number', default: 1 },
    speed: { type: 'number', default: 8 }
  },

  init: function () {
    this.angle = Math.random() * Math.PI * 2;
  },

  tick: function (_time, delta) {
    const scene = this.el.sceneEl;
    const speedMultiplier = scene.timeScale || 0;
    if (scene.orbitPaused || speedMultiplier <= 0) {
      return;
    }

    this.angle += (delta / 1000) * this.data.speed * speedMultiplier;
    const x = Math.cos(this.angle) * this.data.radius;
    const z = Math.sin(this.angle) * this.data.radius;
    this.el.setAttribute('position', `${x} 0 ${z}`);
  }
});

AFRAME.registerComponent('solar-system', {
  init: function () {
    const scene = this.el;
    scene.timeScale = sliderToSpeed(50);
    scene.orbitPaused = false;

    this.cameraRig = document.getElementById('camera-rig');
    this.mainCamera = document.getElementById('main-camera');
    this.infoPanel = document.getElementById('info-panel');
    this.planetName = document.getElementById('planet-name');
    this.planetType = document.getElementById('planet-type');
    this.planetFacts = document.getElementById('planet-facts');
    this.toggleOrbit = document.getElementById('toggle-orbit');
    this.timeSlider = document.getElementById('time-slider');
    this.speedLabel = document.getElementById('speed-label');
    this.flyBack = document.getElementById('fly-back');
    this.closePanel = document.getElementById('close-panel');

    this.flying = false;
    this.selectedPlanet = null;
    this.savedSpeed = scene.timeScale;

    this.bindUi();
    this.bindPlanets();
    this.updateSpeedLabel();
  },

  bindUi: function () {
    this.toggleOrbit.addEventListener('click', () => {
      sceneToggleOrbit(this.el);
      this.syncToggleButton();
    });

    this.timeSlider.addEventListener('input', () => {
      if (this.el.orbitPaused) {
        return;
      }
      this.el.timeScale = sliderToSpeed(this.timeSlider.value);
      this.savedSpeed = this.el.timeScale;
      this.updateSpeedLabel();
    });

    this.flyBack.addEventListener('click', () => {
      this.flyToOverview();
    });

    this.closePanel.addEventListener('click', () => {
      this.hideInfoPanel();
    });
  },

  bindPlanets: function () {
    this.el.querySelectorAll('.planet-body.clickable').forEach((body) => {
      body.addEventListener('click', (event) => {
        event.stopPropagation();
        const planet = body.closest('.planet');
        if (!planet) {
          return;
        }
        this.flyToPlanet(planet);
      });

      body.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
      });

      body.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
      });
    });
  },

  syncToggleButton: function () {
    const paused = this.el.orbitPaused;
    this.toggleOrbit.textContent = paused ? 'Resume orbits' : 'Pause orbits';
    this.toggleOrbit.setAttribute('aria-pressed', paused ? 'true' : 'false');
    this.timeSlider.disabled = paused;
  },

  updateSpeedLabel: function () {
    this.speedLabel.textContent = `Speed: ${formatSpeed(this.el.timeScale)}`;
  },

  showInfoPanel: function (planetId) {
    const data = PLANET_DATA[planetId];
    if (!data) {
      return;
    }

    this.planetName.textContent = data.name;
    this.planetType.textContent = data.type;
    this.planetFacts.textContent = data.facts;
    this.infoPanel.classList.remove('hidden');
  },

  hideInfoPanel: function () {
    this.infoPanel.classList.add('hidden');
  },

  getPlanetFocusPoint: function (planetEl) {
    const world = new THREE.Vector3();
    planetEl.object3D.getWorldPosition(world);
    return world;
  },

  getPlanetVisualRadius: function (planetEl) {
    const body = planetEl.querySelector('.planet-body');
    let radius = body ? Number(body.getAttribute('radius') || 1) : 1;

    planetEl.querySelectorAll('a-ring:not(.orbit-path)').forEach((ring) => {
      const outer = Number(ring.getAttribute('radius-outer') || 0);
      radius = Math.max(radius, outer);
    });

    return radius;
  },

  getCameraTargetPosition: function (planetEl) {
    const focus = this.getPlanetFocusPoint(planetEl);
    const visualRadius = this.getPlanetVisualRadius(planetEl);
    const standoff = Math.max(visualRadius * 10 + 8, 12);
  //  const sunCenter = new THREE.Vector3(0, 0, 0);

    const outward = new THREE.Vector3(0, 0.5, 1).normalize();
    if (outward.lengthSq() < 0.01) {
      outward.set(0, 0.25, 1);
    }
    outward.normalize();

    const cameraPos = focus.clone().add(outward.multiplyScalar(standoff));
    cameraPos.y += visualRadius * 1;

    return { position: cameraPos, lookAt: focus };
  },

  setCameraControlsEnabled: function (enabled) {
    if (!this.mainCamera) {
      return;
    }

    this.mainCamera.setAttribute('look-controls', { enabled: enabled, pointerLockEnabled: false });
    this.mainCamera.setAttribute('wasd-controls', { enabled: enabled, acceleration: 40, fly: true });
  },

  animateCamera: function (targetPosition, lookAt, duration, onComplete) {
    if (!this.cameraRig || !this.mainCamera) {
      return;
    }

    this.flying = true;
    this.savedSpeed = this.el.timeScale || sliderToSpeed(this.timeSlider.value);
    this.el.orbitPaused = true;
    this.el.timeScale = 0;
    this.syncToggleButton();
    this.updateSpeedLabel();
    this.setCameraControlsEnabled(false);

    const startPos = this.cameraRig.object3D.position.clone();
    const startLook = new THREE.Vector3();
    this.mainCamera.object3D.getWorldDirection(startLook);
    startLook.add(this.mainCamera.object3D.getWorldPosition(new THREE.Vector3()));

    const endPos = targetPosition.clone();
    const endLook = lookAt.clone();
    const startTime = performance.now();

    const step = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      this.cameraRig.object3D.position.lerpVectors(startPos, endPos, eased);

      const currentLook = new THREE.Vector3().lerpVectors(startLook, endLook, eased);
      this.mainCamera.object3D.lookAt(currentLook);

      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        this.flying = false;
        this.setCameraControlsEnabled(true);
        if (onComplete) {
          onComplete();
        }
      }
    };

    requestAnimationFrame(step);
  },

  flyToPlanet: function (planetEl) {
    const planetId = planetEl.dataset.planetId;
    if (!planetId) {
      return;
    }

    this.selectedPlanet = planetEl;
    this.showInfoPanel(planetId);

    const { position, lookAt } = this.getCameraTargetPosition(planetEl);
    this.animateCamera(position, lookAt, 1800);
  },

  flyToOverview: function () {
    this.selectedPlanet = null;
    this.hideInfoPanel();

    const targetPosition = new THREE.Vector3(
      OVERVIEW_CAMERA.position.x,
      OVERVIEW_CAMERA.position.y,
      OVERVIEW_CAMERA.position.z
    );
    const lookAt = new THREE.Vector3(
      OVERVIEW_CAMERA.lookAt.x,
      OVERVIEW_CAMERA.lookAt.y,
      OVERVIEW_CAMERA.lookAt.z
    );

    this.animateCamera(targetPosition, lookAt, 1800, () => {
      this.el.orbitPaused = false;
      this.el.timeScale = this.savedSpeed;
      this.timeSlider.value = String(Math.round(Math.pow(this.savedSpeed / 1000, 1 / 2.2) * 1000));
      this.syncToggleButton();
      this.updateSpeedLabel();
    });
  }
});

function sceneToggleOrbit(sceneEl) {
  const system = sceneEl.components['solar-system'];
  if (!system || system.flying) {
    return;
  }

  if (sceneEl.orbitPaused) {
    sceneEl.orbitPaused = false;
    sceneEl.timeScale = system.savedSpeed || sliderToSpeed(system.timeSlider.value);
  } else {
    system.savedSpeed = sceneEl.timeScale;
    sceneEl.orbitPaused = true;
    sceneEl.timeScale = 0;
  }

  system.syncToggleButton();
  system.updateSpeedLabel();
}

document.addEventListener('click', function(event) {
  const clickSound = document.getElementById('globalClickSound');
  if (!clickSound) return;
  
  // Wait a frame to ensure component is ready
  setTimeout(() => {
    const soundComp = clickSound.components.sound;
    if (soundComp) {
      soundComp.stopSound();
      soundComp.playSound();
    }
  }, 0);
});