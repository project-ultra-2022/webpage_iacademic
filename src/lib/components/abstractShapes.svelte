<script>
  import { onMount } from 'svelte';
  import Zdog from 'zdog';
  import anime from 'animejs';

  let numPerceptrons = 100;
  let numConnections = 15;
  let perceptrons = [], connections = [];

  let illo;
  let logoLayers = [];
  let containerEl;
  let anchor;
  let canvasEl;
  const LAYER_COUNT = 3; // 3 copias
  let logoOffsetX = -15;

  function vectorCompare(v1, v2) {
    return v1.x === v2.x && v1.y === v2.y && v1.z === v2.z;
  }

  function animate() {
    illo.rotate.x += 0.002;
    illo.rotate.y += 0.002;
    illo.rotate.z += 0.0015;
    illo.updateRenderGraph();
    requestAnimationFrame(animate);
  }

  onMount(() => {
    // --- Zdog ---
    // Use the bound canvas element instead of a global selector so the
    // illustration is scoped to this component and will move with the
    // hero container (which is `position: relative` in `hero.svelte`).
    illo = new Zdog.Illustration({
      element: canvasEl,
      resize: true
    });

    for (let i = 0; i < numPerceptrons; i++) {
      let perceptron = new Zdog.Shape({
        addTo: illo,
        stroke: 3,
        color: 'white',
        fill: false,
        translate: { x: 1, y: 2, z: 1 }
      });

      anime({
        targets: perceptron.translate,
        x: anime.random(-250, 250),
        y: anime.random(-250, 250),
        z: anime.random(-300, 300),
        duration: 1000
      });

      perceptrons.push(perceptron);
    }

    for (let i = 0; i < numConnections; i++) {
      let connection = new Zdog.Shape({
        addTo: illo,
        path: [{ line: { x: 0, y: 0, z: 0 } }, { line: { x: 0, y: 0, z: 0 } }],
        stroke: 2,
        color: '#1f3c88'
      });

      let travel = () => {
        let p;
        do {
          p = perceptrons[(perceptrons.length * Math.random()) >> 0].translate;
        } while (vectorCompare(p, connection.path[1].line));

        let { x, y, z } = p;

        anime.timeline({
          easing: 'easeInOutExpo',
          duration: 500,
          update() {
            connection.updatePath();
          }
        })
        .add({ targets: connection.path[1].line, x, y, z })
        .add({ targets: connection.path[0].line, x, y, z })
        .finished.then(travel);
      };

      travel();
    }

  // --- 6 capas del logo posicionadas exactamente donde iba el logo del 2º código ---
  // Use Svelte refs bound to the elements so they remain inside the hero
  // and will scroll together with the hero background.
  // `containerEl` and `anchor` are bound in the markup via `bind:this`.

    function placeLayers() {
      const rectContainer = containerEl.getBoundingClientRect();
      const rectAnchor = anchor.getBoundingClientRect();

  const centerX = rectAnchor.left - rectContainer.left + rectAnchor.width / 2 + logoOffsetX; // offset configurable
      const centerY = rectAnchor.top - rectContainer.top + rectAnchor.height / 2 - 0; // offset down

      const widthPx = rectAnchor.width; // usar tamaño computado (responsivo)

      // Limpieza previa
      logoLayers.forEach(n => n.remove());
      logoLayers = [];

      for (let i = 0; i < LAYER_COUNT; i++) {
        const img = document.createElement('img');
        img.src = '/logos/mobile-white.svg';
        img.className = 'svg-logo-layer';
        img.style.position = 'absolute';
        img.style.left = centerX + 'px';
        img.style.top = centerY + 'px';
        img.style.transform = 'translate(-50%, -50%)';
        img.style.width = widthPx + 'px';
        img.style.height = 'auto';
        img.style.opacity = '0.85';
        img.style.zIndex = String(10 + i); // por encima del canvas
        img.dataset.layer = String(i);

        containerEl.appendChild(img);
        logoLayers.push(img);
      }

      // Animaciones por capa (rotaciones y leve escala)
      const rotations = [
        { rx: 360, ry: 0,   rz: 0   },
        { rx: 0,   ry: 360, rz: 0   },
        { rx: 0,   ry: 0,   rz: 360 },
        { rx: 180, ry: 180, rz: 0   },
        { rx: 180, ry: 0,   rz: 180 },
        { rx: 0,   ry: 180, rz: 180 }
      ];

      logoLayers.forEach((el, idx) => {
        const rot = rotations[idx];
        anime({
          targets: el,
          rotateX: rot.rx,
          rotateY: rot.ry,
          rotateZ: rot.rz,
          scale: 0.9 + (idx * 0.05),
          duration: 3000 + idx * 500,
          easing: 'easeInOutSine',
          loop: true,
          direction: 'alternate',
          delay: idx * 200
        });
      });
    }

  // Colocar capas inicial y en resize
  placeLayers();
  window.addEventListener('resize', placeLayers);

    // Iniciar render loop
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', placeLayers);
      logoLayers.forEach(n => n.remove());
      logoLayers = [];
    };
  });
</script>

<div class="container" bind:this={containerEl}>
  <img class="svg-logo-anchor" bind:this={anchor} src="/logos/mobile-white.svg" alt="Logo móvil (ancla)" />
  <canvas class="zdog" bind:this={canvasEl}></canvas>
</div>

<style>
  .container {
    /* Fill the hero area so the shapes are anchored to the hero and
       scroll with it. The hero wrapper already has `position: relative`. */
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none; /* allow clicks through the shapes */
  }

  /* El anchor NO se debe ver, pero sí ocupar layout para calcular bounding box */
  .svg-logo-anchor {
    position: absolute;
    width: 14%;
    height: auto;
    top: 40%;
    transform-origin: center;
    clip-path: circle(50%);
    opacity: 0;           /* invisible */
    pointer-events: none; /* no interfiere */
  }

  /* Capas dinámicas del logo (6) */
  .svg-logo-layer {
    transform-origin: center;
    clip-path: circle(50%); /* igual que el anchor */
    will-change: transform;
  }

  .zdog {
    display: block;
    width: 100%;
    height: 100%;
    z-index: 0;
  }

  @media (max-width: 768px) {
    .container {
      width: 100%;
      height: 45%;
      top: 6%;
      opacity: 0.5;
    }
    .svg-logo-anchor {
      width: 20%;
      top: 45%;
    }
  }

  @media (min-width: 769px) {
    .container {
      /* keep it full-area; inner anchor can be positioned responsively */
    }
  }

  @media (min-width: 1400px) {
    .svg-logo-anchor {
      width: 10%;
      top: 42%;
    }
  }
</style>
