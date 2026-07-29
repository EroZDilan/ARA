'use client';
import { useEffect, useRef } from 'react';
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, Vector2, Vector3,
  SphereGeometry, ConeGeometry, BoxGeometry, CylinderGeometry,
  MeshStandardMaterial, HemisphereLight, DirectionalLight, Raycaster, MathUtils,
} from 'three';

/**
 * Guacamayo 3D global: un solo canvas fixed que vuela entre las secciones
 * marcadas con data-perch-x / data-perch-y / data-perch-scale / data-perch-face / data-perch-hidden.
 * Montar UNA vez en page.tsx vía next/dynamic (ssr: false). Ver INTEGRACION.md.
 */

const FACTS = [
  'El ara tricolor (Ara tricolor) era el único guacamayo nativo de Cuba.',
  'Medía unos 50 cm: el más pequeño de los guacamayos del Caribe.',
  'Se alimentaba de semillas de palma real y frutos de chinaberry.',
  'El último ejemplar confirmado fue cazado cerca de la Ciénaga de Zapata, hacia 1864.',
  'Hoy solo quedan 19 pieles de ara tricolor en museos del mundo.',
  'Anidaba en huecos de palmas muertas, en parejas de por vida.',
  'Su plumaje mezclaba rojo escarlata, amarillo, azul y verde.',
];

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
function lerpAngle(a: number, b: number, t: number) {
  let d = (b - a) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return a + d * t;
}
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function mat(c: number) {
  return new MeshStandardMaterial({ color: c, roughness: 0.8, metalness: 0, flatShading: true });
}

function buildMacaw() {
  const M = {
    red: mat(0xd83a2e), red2: mat(0xb92a15), yellow: mat(0xf2b631), green: mat(0x3f9142),
    blue: mat(0x4a8fd8), dark: mat(0x1a1512), white: mat(0xf5f1e8),
  };
  const root = new Group();
  const bird = new Group(); root.add(bird);
  const body = new Mesh(new SphereGeometry(0.5, 16, 12), M.red);
  body.scale.set(0.9, 1.25, 1.05); body.rotation.x = -0.2; bird.add(body);
  const head = new Group(); head.position.set(0, 0.66, 0.3); bird.add(head);
  const skull = new Mesh(new SphereGeometry(0.32, 14, 10), M.red); head.add(skull);
  const nape = new Mesh(new SphereGeometry(0.2, 12, 9), M.yellow);
  nape.position.set(0, 0.13, -0.15); nape.scale.set(1.15, 0.75, 0.9); head.add(nape);
  const face = new Mesh(new SphereGeometry(0.17, 12, 9), M.white);
  face.position.set(0, -0.02, 0.23); face.scale.set(1.25, 1.05, 0.55); head.add(face);
  const beakU = new Mesh(new ConeGeometry(0.11, 0.36, 10), M.dark);
  beakU.position.set(0, -0.07, 0.38); beakU.rotation.x = 2.55; head.add(beakU);
  const beakL = new Mesh(new ConeGeometry(0.07, 0.16, 8), M.dark);
  beakL.position.set(0, -0.17, 0.32); beakL.rotation.x = 2.9; head.add(beakL);
  for (const s of [-1, 1]) {
    const eye = new Mesh(new SphereGeometry(0.045, 8, 6), M.dark);
    eye.position.set(s * 0.135, 0.06, 0.26); head.add(eye);
  }
  function wing(sign: number) {
    const g = new Group(); g.position.set(sign * 0.34, 0.2, 0.02);
    const parts: [MeshStandardMaterial, number, number, number, number, number, number][] = [
      [M.yellow, 0.5, 0.42, 0.25, 0.03, 0.04, 0],
      [M.green, 0.58, 0.38, 0.6, 0, -0.05, -0.16],
      [M.blue, 0.62, 0.32, 1.0, -0.03, -0.15, -0.36],
    ];
    for (const [m, w, d, x, y, z, ry] of parts) {
      const f = new Mesh(new BoxGeometry(w, 0.07, d), m);
      f.position.set(sign * x, y, z); f.rotation.y = sign * ry; g.add(f);
    }
    bird.add(g); return g;
  }
  const wingL = wing(1), wingR = wing(-1);
  const tail = new Group(); tail.position.set(0, -0.48, -0.3); tail.rotation.x = -0.5; bird.add(tail);
  for (const ry of [-0.17, 0, 0.17]) {
    const f = new Mesh(new BoxGeometry(0.13, 0.05, 1.05), M.red2);
    f.position.set(0, 0, -0.5);
    const tip = new Mesh(new BoxGeometry(0.135, 0.055, 0.32), M.blue);
    tip.position.set(0, 0, -0.92);
    const fg = new Group(); fg.rotation.y = ry; fg.add(f, tip); tail.add(fg);
  }
  for (const s of [-1, 1]) {
    const foot = new Mesh(new CylinderGeometry(0.05, 0.06, 0.2, 8), M.dark);
    foot.position.set(s * 0.13, -0.66, 0.12); bird.add(foot);
  }
  return { root, head, wingL, wingR, tail };
}

function squawk(ctxRef: { ac: AudioContext | null }) {
  const AC = (ctxRef.ac ||= new AudioContext());
  if (AC.state === 'suspended') AC.resume();
  const t = AC.currentTime;
  const o = AC.createOscillator(), g = AC.createGain(), f = AC.createBiquadFilter();
  o.type = 'sawtooth';
  o.frequency.setValueAtTime(1450, t);
  o.frequency.exponentialRampToValueAtTime(520, t + 0.28);
  const lfo = AC.createOscillator(), lg = AC.createGain();
  lfo.type = 'square'; lfo.frequency.value = 85; lg.gain.value = 0.4;
  lfo.connect(lg); lg.connect(g.gain);
  f.type = 'bandpass'; f.frequency.value = 1200; f.Q.value = 1.8;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(0.22, t + 0.025);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.34);
  o.connect(f); f.connect(g); g.connect(AC.destination);
  o.start(t); o.stop(t + 0.36); lfo.start(t); lfo.stop(t + 0.36);
}

export default function GuacamayoScene({
  sonido = true, datos = true, pantallaDeCarga = true,
}: { sonido?: boolean; datos?: boolean; pantallaDeCarga?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    const cv = renderer.domElement;
    Object.assign(cv.style, { position: 'fixed', inset: '0', width: '100%', height: '100%', zIndex: '10', pointerEvents: 'none' } as CSSStyleDeclaration);
    wrap.appendChild(cv);

    const scene = new Scene();
    const camera = new PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0, 10);
    scene.add(new HemisphereLight(0xdfe9ff, 0x1b2c3d, 1.1));
    const key = new DirectionalLight(0xfff1d6, 2.0); key.position.set(4, 6, 6); scene.add(key);
    const rim = new DirectionalLight(0x4a8fd8, 0.9); rim.position.set(-5, 2, -4); scene.add(rim);

    const { root, head, wingL, wingR, tail } = buildMacaw();
    scene.add(root);

    // tooltip
    const tooltip = document.createElement('div');
    Object.assign(tooltip.style, {
      position: 'fixed', zIndex: '60', maxWidth: '270px', padding: '12px 16px',
      background: '#132b41', color: '#f5f1e8', border: '1px solid rgba(245,241,232,.14)',
      borderRadius: '14px 14px 14px 4px', font: '500 14px/1.45 Inter, sans-serif',
      opacity: '0', transform: 'translateY(6px)', transition: 'opacity .3s, transform .3s',
      pointerEvents: 'none', boxShadow: '0 12px 30px rgba(3,10,18,.5)',
    } as CSSStyleDeclaration);
    wrap.appendChild(tooltip);
    let tooltipTimer: ReturnType<typeof setTimeout>;

    // veil (pantalla de carga)
    let veil: HTMLDivElement | null = null;
    if (pantallaDeCarga && !reduced) {
      veil = document.createElement('div');
      veil.innerHTML =
        '<div style="font:600 clamp(34px,4.5vw,54px)/1 var(--font-serif,\'Cormorant Garamond\'),serif; letter-spacing:.02em; color:#f5f1e8">ARA</div>' +
        '<div style="font:500 11px/1 Inter,sans-serif; letter-spacing:.22em; text-transform:uppercase; color:#97a8b8; margin-top:18px">Conservación de aves endémicas de Cuba</div>';
      Object.assign(veil.style, {
        position: 'fixed', inset: '0', zIndex: '9',
        background: 'radial-gradient(120% 90% at 50% 30%, #0b2744 0%, #071726 60%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
        paddingBottom: '12vh', transition: 'opacity .9s ease', pointerEvents: 'none',
      } as CSSStyleDeclaration);
      wrap.appendChild(veil);
      document.documentElement.style.overflow = 'hidden';
      window.scrollTo(0, 0);
    }

    let halfH = 1, halfW = 1;
    function resize() {
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      halfH = Math.tan(MathUtils.degToRad(19)) * 10;
      halfW = halfH * camera.aspect;
    }
    resize();
    const worldAt = (fx: number, fy: number) => new Vector3(fx * 2 * halfW, fy * 2 * halfH, 0);

    type Stop = { mid: number; fx: number; fy: number; sc: number; face: string; hidden: boolean };
    let stops: Stop[] = [];
    function computeStops() {
      stops = Array.from(document.querySelectorAll<HTMLElement>('[data-perch-x]')).map((el) => {
        const r = el.getBoundingClientRect();
        return {
          mid: r.top + scrollY + r.height / 2,
          fx: +(el.dataset.perchX || 0), fy: +(el.dataset.perchY || 0),
          sc: +(el.dataset.perchScale || 1), face: el.dataset.perchFace || 'left',
          hidden: el.dataset.perchHidden === '1',
        };
      });
    }
    computeStops();
    // relayout: barato al inicio (imágenes/fonts cargando), espaciado después
    let poll = setInterval(computeStops, 400);
    const pollDowngrade = setTimeout(() => { clearInterval(poll); poll = setInterval(computeStops, 2500); }, 9000);
    const onResize = () => { resize(); computeStops(); };
    addEventListener('resize', onResize);

    const finePointer = matchMedia('(pointer:fine)').matches;
    const mouse = new Vector2(0, 0);
    const ray = new Raycaster();
    const audio = { ac: null as AudioContext | null };
    let hover = false, grabbing = false, moved = 0, lastX = 0, dragYaw = 0, dragVel = 0;
    let excite = 0;

    const onMove = (e: PointerEvent) => {
      mouse.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1));
      if (grabbing) {
        const dx = e.clientX - lastX; lastX = e.clientX;
        moved += Math.abs(dx); dragYaw += dx * 0.012; dragVel = dx * 0.02;
      }
    };
    const onDown = (e: PointerEvent) => {
      ray.setFromCamera(new Vector2((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)), camera);
      if (ray.intersectObject(root, true).length) {
        grabbing = true; moved = 0; lastX = e.clientX;
        document.body.style.cursor = 'grabbing';
      }
    };
    const onUp = (e: PointerEvent) => {
      if (!grabbing) return;
      grabbing = false;
      document.body.style.cursor = hover ? 'grab' : '';
      if (moved > 6) return; // fue arrastre, no click
      if (sonido) squawk(audio);
      excite = 1;
      if (datos) {
        tooltip.textContent = FACTS[Math.floor(Math.random() * FACTS.length)];
        tooltip.style.left = clamp(e.clientX + 14, 10, innerWidth - 290) + 'px';
        tooltip.style.top = clamp(e.clientY - 70, 10, innerHeight - 120) + 'px';
        tooltip.style.opacity = '1'; tooltip.style.transform = 'translateY(0)';
        clearTimeout(tooltipTimer);
        tooltipTimer = setTimeout(() => { tooltip.style.opacity = '0'; tooltip.style.transform = 'translateY(6px)'; }, 4200);
      }
    };
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerdown', onDown);
    addEventListener('pointerup', onUp);

    const pos = new Vector3(-1, 1, 0);
    const prev = new Vector3(), vel = new Vector3();
    let yaw = 0.9, pitch = 0, roll = 0, hYaw = 0, hPitch = 0;
    let flap = 0, scale = 0.001;
    let entryT = reduced ? 1 : 0, started = 0, revealed = false;
    const A = new Vector3(), B = new Vector3(), C1 = new Vector3(), C2 = new Vector3(), TGT = new Vector3();
    let frame = 0, last = performance.now(), raf = 0;

    function cubicTo(P0: Vector3, Q1: Vector3, Q2: Vector3, P3: Vector3, t: number, out: Vector3) {
      const u = 1 - t, uu = u * u, tt = t * t;
      out.set(
        u * uu * P0.x + 3 * uu * t * Q1.x + 3 * u * tt * Q2.x + t * tt * P3.x,
        u * uu * P0.y + 3 * uu * t * Q1.y + 3 * u * tt * Q2.y + t * tt * P3.y,
        u * uu * P0.z + 3 * uu * t * Q1.z + 3 * u * tt * Q2.z + t * tt * P3.z,
      );
    }

    function scrollTarget() {
      if (!stops.length) return { p: TGT.copy(worldAt(0.24, 0.03)), s: 1, face: 'left', travel: 0, flare: 0 };
      const vc = scrollY + innerHeight / 2;
      let i = 0, t = 0;
      for (let k = 0; k < stops.length - 1; k++) {
        const sa = stops[k].mid - vc, sb = stops[k + 1].mid - vc;
        if (sa <= 0 && sb > 0) { i = k; t = sa / (sa - sb); break; }
        if (sb <= 0) { i = k; t = 1; }
      }
      if (stops[0].mid - vc > 0) { i = 0; t = 0; }
      const a = stops[i], b = stops[Math.min(i + 1, stops.length - 1)];
      A.copy(worldAt(a.fx, a.fy)); B.copy(worldAt(b.fx, b.fy));
      const te = easeIO(clamp(t, 0, 1));
      C1.copy(A).lerp(B, 0.3); C1.y += 1.9; C1.z += 1.1;
      C2.copy(A).lerp(B, 0.72); C2.y += 2.3; C2.z += 0.9;
      cubicTo(A, C1, C2, B, te, TGT);
      let travel = Math.sin(te * Math.PI);
      if (a.hidden) travel = Math.max(travel, 1 - te);
      if (b.hidden) travel = Math.max(travel, te);
      const flare = Math.sin(clamp((te - 0.62) / 0.38, 0, 1) * Math.PI) * (b.hidden ? 0 : 1);
      return { p: TGT, s: lerp(a.sc, b.sc, te), face: te < 0.5 ? a.face : b.face, travel, flare };
    }

    function reveal() {
      revealed = true;
      setTimeout(() => {
        if (veil) {
          veil.style.opacity = '0';
          document.documentElement.style.overflow = '';
          computeStops();
          setTimeout(() => veil?.remove(), 1000);
        }
      }, 400);
    }
    if (!pantallaDeCarga || reduced) revealed = true;

    function tick(now: number) {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      const time = now / 1000;
      const tgt = scrollTarget();
      let travel = tgt.travel, flare = tgt.flare;
      if (entryT < 1) {
        if (!started) { started = now + 350; pos.copy(worldAt(-0.9, 0.62)); pos.z = 1.5; }
        entryT = clamp((now - started) / 3200, 0, 1);
        const e = easeIO(entryT);
        const S = worldAt(-0.9, 0.62); S.z = 1.5;
        C1.copy(worldAt(-0.5, 0.5)); C1.z = 2.2;
        C2.copy(tgt.p); C2.x -= 2.2; C2.y += 1.9; C2.z = 1.2;
        cubicTo(S, C1, C2, tgt.p, e, TGT);
        travel = Math.max(travel, 1 - e * 0.9);
        flare = Math.max(flare, Math.sin(clamp((e - 0.6) / 0.4, 0, 1) * Math.PI));
      } else if (!revealed) reveal();

      prev.copy(pos);
      pos.lerp(entryT < 1 ? TGT : tgt.p, 1 - Math.pow(0.0015, dt));
      vel.copy(pos).sub(prev).divideScalar(Math.max(dt, 0.001));
      const speed = vel.length();
      const flying = clamp(speed / 5, 0, 1) * 0.5 + clamp(travel * 1.4, 0, 1) * 0.5;

      if (!grabbing) { dragYaw += dragVel; dragVel *= 0.94; dragYaw = lerp(dragYaw, 0, 1 - Math.pow(0.55, dt)); }
      if (flying > 0.4) { dragYaw *= 0.9; dragVel = 0; }

      const perchYaw = tgt.face === 'right' ? 0.55 : -0.55;
      let tYaw = perchYaw, tPitch = 0, tRoll = 0;
      if (flying > 0.25 && speed > 0.4) {
        tYaw = Math.atan2(vel.x, vel.z + 0.0001);
        tPitch = clamp(-vel.y * 0.09, -0.45, 0.45) - flare * 0.38 * clamp(speed / 3, 0, 1);
        tRoll = clamp(-vel.x * 0.09, -0.6, 0.6);
      }
      const yawK = 1 - Math.pow(flying > 0.25 ? 0.002 : grabbing ? 0.00001 : 0.01, dt);
      yaw = lerpAngle(yaw, tYaw + dragYaw, yawK);
      pitch = lerp(pitch, tPitch, 0.09); roll = lerp(roll, tRoll, 0.08);

      const track = finePointer && !grabbing ? 1 - clamp(flying * 1.6, 0, 1) : 0;
      hYaw = lerp(hYaw, clamp(mouse.x * 0.9 - yaw, -0.65, 0.65) * track, 0.07);
      hPitch = lerp(hPitch, clamp(-mouse.y * 0.4, -0.35, 0.35) * track + (excite > 0 ? Math.sin(excite * 14) * 0.18 * excite : 0), 0.1);
      head.rotation.y = hYaw; head.rotation.x = hPitch;
      head.rotation.z = excite * Math.sin(excite * 9) * 0.22;

      excite = Math.max(0, excite - dt * 0.9);
      flap += dt * (2.6 + travel * 16 + flare * 4 + excite * 10);
      const amp = 0.1 + travel * 0.85 + flare * 0.25 + excite * 0.55;
      const base = -0.12 - travel * 0.15 + flare * 0.3;
      wingL.rotation.z = -(base + Math.sin(flap) * amp);
      wingR.rotation.z = base + Math.sin(flap) * amp;
      tail.rotation.y = Math.sin(time * 1.1) * 0.08;
      tail.rotation.x = -0.5 + travel * 0.35 + flare * 0.25;

      scale = lerp(scale, tgt.s * 0.92, 0.06);
      root.scale.setScalar(scale);
      root.position.copy(pos);
      root.position.y += Math.sin(time * 1.6) * 0.07 * (1 - travel) + excite * 0.12 * Math.abs(Math.sin(excite * 7));
      root.rotation.set(pitch, yaw, roll);

      if (finePointer && !grabbing && travel < 0.5 && frame++ % 10 === 0) {
        ray.setFromCamera(mouse, camera);
        const h = ray.intersectObject(root, true).length > 0;
        if (h !== hover) { hover = h; document.body.style.cursor = h ? 'grab' : ''; }
      }
      renderer.render(scene, camera);
    }

    // pausa el render loop cuando la pestaña no está visible
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(poll); clearTimeout(pollDowngrade); clearTimeout(tooltipTimer);
      removeEventListener('resize', onResize);
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      document.removeEventListener('visibilitychange', onVis);
      document.documentElement.style.overflow = '';
      document.body.style.cursor = '';
      audio.ac?.close();
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as Mesh;
        if (m.geometry) m.geometry.dispose();
        if (m.material) (Array.isArray(m.material) ? m.material : [m.material]).forEach((mm) => mm.dispose());
      });
      wrap.replaceChildren();
    };
  }, [sonido, datos, pantallaDeCarga]);

  return <div ref={wrapRef} aria-hidden="true" />;
}
