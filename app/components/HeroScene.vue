<script setup lang="ts">
import * as THREE from 'three'

const host = ref<HTMLDivElement>()
const ready = ref(false)

const GOLD = new THREE.Color('#fff83f')
const AMBER = new THREE.Color('#e8dc1a')
const HOT = new THREE.Color('#fffdc4')
const DIM = new THREE.Color('#5a5608')
const BG = 0x0b0a08
const GLYPHS = ['$', '€', '£', '¥', '₣', '₹', 'A$', 'C$']

const terrainVert = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  varying float vH;
  varying float vZ;
  varying float vD;
  varying float vFade;
  void main() {
    vec3 p = position;
    float d = length(p.xz - vec2(0.0, -14.0));
    float h = sin(p.x * 0.16 + uTime * 0.25) * 0.9
            + sin(p.z * 0.22 - uTime * 0.18) * 0.7
            + sin(d * 0.35 - uTime * 1.2) * 0.6 * smoothstep(30.0, 6.0, d)
            + sin(length(p.xz - uPointer * vec2(22.0, 10.0)) * 0.5 - uTime * 1.4) * 0.25;
    p.y += h;
    vH = h;
    vZ = p.z;
    vD = d;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vFade = smoothstep(80.0, 12.0, -mv.z) * smoothstep(50.0, 28.0, abs(p.x));
    gl_Position = projectionMatrix * mv;
  }
`

const terrainFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uScan;
  varying float vH;
  varying float vZ;
  varying float vD;
  varying float vFade;
  void main() {
    float k = smoothstep(-1.8, 2.2, vH);
    vec3 col = mix(uLow, uHigh, k);
    float scanZ = mod(uTime * 8.0, 70.0) - 58.0;
    float scan = exp(-pow((vZ - scanZ) / 1.4, 2.0));
    // sonar rings travelling out from the globe, plus a still glow beneath it
    float ring = smoothstep(0.9, 1.0, fract(vD * 0.055 - uTime * 0.22));
    float pulse = ring * smoothstep(2.0, 9.0, vD);
    float hub = exp(-vD * vD / 90.0);
    col += uScan * (scan * 1.3 + pulse * 0.8) + uHigh * hub * 0.35;
    gl_FragColor = vec4(col, (0.2 + k * 0.6 + scan * 0.9 + pulse * 0.55 + hub * 0.25) * vFade);
  }
`

const globeVert = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  attribute float aSeed;
  varying float vFace;
  varying float vSeed;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * position);
    vFace = smoothstep(-0.35, 0.65, n.z);
    vSeed = aSeed;
    float tw = 0.65 + 0.35 * sin(uTime * 2.2 + aSeed * 40.0);
    gl_PointSize = uSize * (22.0 / -mv.z) * mix(0.55, 1.0, vFace) * tw;
    gl_Position = projectionMatrix * mv;
  }
`

const globeFrag = /* glsl */ `
  uniform vec3 uBase;
  uniform vec3 uHot;
  varying float vFace;
  varying float vSeed;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    if (d > 1.0) discard;
    vec3 col = vSeed > 0.9 ? uHot : uBase;
    gl_FragColor = vec4(col, smoothstep(1.0, 0.15, d) * mix(0.1, 0.9, vFace));
  }
`

const shellVert = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    vP = position;
    gl_Position = projectionMatrix * mv;
  }
`

const shellFrag = /* glsl */ `
  uniform float uTime;
  uniform vec3 uRim;
  uniform vec3 uHot;
  varying vec3 vN;
  varying vec3 vV;
  varying vec3 vP;
  void main() {
    // abs() because the back faces are rendered: their normals point away from the camera
    float f = 1.0 - abs(dot(normalize(vN), normalize(vV)));
    float rim = pow(f, 3.5);
    float band = smoothstep(0.9, 1.0, sin(vP.y * 1.1 - uTime * 0.8) * 0.5 + 0.5);
    vec3 col = mix(uRim, uHot, band * 0.6);
    gl_FragColor = vec4(col, rim * 0.42 + band * 0.05);
  }
`

const trailVert = /* glsl */ `
  attribute float aT;
  attribute float aSeed;
  varying float vT;
  varying float vSeed;
  void main() {
    vT = aT;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const trailFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSpeed;
  uniform float uLen;
  uniform float uBase;
  uniform vec3 uColor;
  varying float vT;
  varying float vSeed;
  void main() {
    float head = fract(uTime * uSpeed * (0.6 + vSeed * 0.8) + vSeed * 7.31);
    float d = head - vT;
    float trail = d > 0.0 && d < uLen ? pow(1.0 - d / uLen, 2.0) : 0.0;
    gl_FragColor = vec4(uColor, uBase + trail);
  }
`

const priceVert = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  attribute float aX;
  varying float vX;
  void main() {
    float x = aX;
    float t = uTime * (0.3 + uSeed * 0.1);
    float y = sin(x * 0.21 + t + uSeed * 3.1) * 1.2
            + sin(x * 0.57 - t * 1.6 + uSeed) * 0.5
            + sin(x * 1.9 + t * 2.4 + uSeed * 7.0) * 0.16
            + floor(sin(x * 3.1 + uSeed) * 2.0) * 0.08;
    vX = x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, 0.0, 1.0);
  }
`

const priceFrag = /* glsl */ `
  uniform float uTime;
  uniform float uSeed;
  uniform vec3 uColor;
  uniform vec3 uHot;
  varying float vX;
  void main() {
    float edge = smoothstep(-46.0, -22.0, vX) * smoothstep(46.0, 22.0, vX);
    float head = mod(uTime * 9.0 + uSeed * 30.0, 110.0) - 55.0;
    float g = exp(-pow((vX - head) / 2.5, 2.0));
    gl_FragColor = vec4(mix(uColor, uHot, g), (0.45 + g) * edge);
  }
`

const flatVert = /* glsl */ `
  void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
`

const flatFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uAlpha;
  void main() { gl_FragColor = vec4(uColor, uAlpha); }
`

const circle = (r: number, n = 180) => {
  const pts: THREE.Vector3[] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r))
  }
  return new THREE.BufferGeometry().setFromPoints(pts)
}

const glyphTexture = (g: string) => {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const x = c.getContext('2d')!
  x.fillStyle = '#fff83f'
  x.font = `600 ${g.length > 1 ? 56 : 80}px "Space Grotesk Variable", system-ui, sans-serif`
  x.textAlign = 'center'
  x.textBaseline = 'middle'
  x.fillText(g, 64, 70)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

let cleanup: (() => void) | undefined

onMounted(() => {
  const el = host.value
  if (!el) return
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
  const small = matchMedia('(max-width: 768px)').matches
  const touch = !matchMedia('(hover: hover) and (pointer: fine)').matches
  const CAM = small ? new THREE.Vector3(0, 3.4, 15) : new THREE.Vector3(0, 5, 22)

  let renderer: THREE.WebGLRenderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: !small, alpha: true, powerPreference: small ? 'default' : 'high-performance' })
  }
  catch {
    return
  }
  renderer.setClearColor(0x000000, 0)
  el.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.fog = new THREE.Fog(BG, 34, 85)
  const camera = new THREE.PerspectiveCamera(52, 1, 0.1, 200)
  camera.position.copy(CAM)

  const add = { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending } as const
  const time = { value: 0 }
  const disposables: { dispose: () => void }[] = []
  const track = <T extends { dispose: () => void }>(x: T) => { disposables.push(x); return x }
  const flat = (c: THREE.Color, a: number) => track(new THREE.ShaderMaterial({ vertexShader: flatVert, fragmentShader: flatFrag, uniforms: { uColor: { value: c }, uAlpha: { value: a } }, ...add }))

  // Neon wireframe floor with a scanning beam and a ripple under the globe
  const cols = small ? 34 : 110
  const rows = small ? 30 : 80
  const gap = small ? 1.2 : 0.85
  const tPos = new Float32Array(cols * rows * 3)
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 3
      tPos[k] = (i - (cols - 1) / 2) * gap
      tPos[k + 2] = -j * gap + 10
    }
  const idx: number[] = []
  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      const v = j * cols + i
      if (i < cols - 1) idx.push(v, v + 1)
      if (j < rows - 1) idx.push(v, v + cols)
    }
  const tGeo = track(new THREE.BufferGeometry())
  tGeo.setAttribute('position', new THREE.BufferAttribute(tPos, 3))
  tGeo.setIndex(idx)
  const tMat = track(new THREE.ShaderMaterial({
    vertexShader: terrainVert,
    fragmentShader: terrainFrag,
    uniforms: { uTime: time, uPointer: { value: new THREE.Vector2() }, uLow: { value: DIM }, uHigh: { value: GOLD }, uScan: { value: HOT } },
    ...add,
  }))
  const terrain = new THREE.LineSegments(tGeo, tMat)
  terrain.position.y = -5
  terrain.frustumCulled = false
  scene.add(terrain)

  // Centred holographic globe
  const core = new THREE.Group()
  core.position.set(0, small ? 2.6 : 3.2, small ? -10 : -14)
  scene.add(core)
  const globe = new THREE.Group()
  globe.rotation.z = 0.3
  core.add(globe)
  const R = small ? 4 : 5.2
  const gCount = small ? 700 : 2000
  const gPos = new Float32Array(gCount * 3)
  const gSeed = new Float32Array(gCount)
  for (let i = 0; i < gCount; i++) {
    const y = 1 - (i / (gCount - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const th = i * Math.PI * (3 - Math.sqrt(5))
    gPos.set([Math.cos(th) * r * R, y * R, Math.sin(th) * r * R], i * 3)
    gSeed[i] = Math.random()
  }
  const gGeo = track(new THREE.BufferGeometry())
  gGeo.setAttribute('position', new THREE.BufferAttribute(gPos, 3))
  gGeo.setAttribute('aSeed', new THREE.BufferAttribute(gSeed, 1))
  const gMat = track(new THREE.ShaderMaterial({
    vertexShader: globeVert,
    fragmentShader: globeFrag,
    uniforms: { uTime: time, uSize: { value: small ? 2.3 : 2.7 }, uBase: { value: GOLD }, uHot: { value: HOT } },
    ...add,
  }))
  globe.add(new THREE.Points(gGeo, gMat))

  // Fresnel shell: gives the point cloud a rim so it reads as a sphere, not confetti
  const shell = new THREE.Mesh(
    track(new THREE.SphereGeometry(R * 1.004, 48, 32)),
    track(new THREE.ShaderMaterial({
      vertexShader: shellVert,
      fragmentShader: shellFrag,
      uniforms: { uTime: time, uRim: { value: GOLD }, uHot: { value: HOT } },
      side: THREE.BackSide,
      ...add,
    })),
  )
  globe.add(shell)
  ;[0, Math.PI / 3, -Math.PI / 3].forEach((rx, i) => {
    const l = new THREE.LineLoop(track(circle(R * 1.003)), flat(i ? AMBER : GOLD, i ? 0.14 : 0.35))
    l.rotation.set(rx, i * 0.6, 0)
    globe.add(l)
  })

  // Data arcs between financial centres
  const arcs = small ? 6 : 16
  const segs = small ? 32 : 50
  const aPos: number[] = []
  const aT: number[] = []
  const aS: number[] = []
  const aIdx: number[] = []
  const onSphere = () => new THREE.Vector3().randomDirection().multiplyScalar(R)
  for (let a = 0; a < arcs; a++) {
    const p0 = onSphere()
    const p1 = onSphere()
    const mid = p0.clone().add(p1).multiplyScalar(0.5).normalize().multiplyScalar(R * (1.3 + Math.random() * 0.35))
    const seed = Math.random()
    const base = aPos.length / 3
    new THREE.QuadraticBezierCurve3(p0, mid, p1).getPoints(segs).forEach((p, i) => {
      aPos.push(p.x, p.y, p.z)
      aT.push(i / segs)
      aS.push(seed)
      if (i) aIdx.push(base + i - 1, base + i)
    })
  }
  const aGeo = track(new THREE.BufferGeometry())
  aGeo.setAttribute('position', new THREE.Float32BufferAttribute(aPos, 3))
  aGeo.setAttribute('aT', new THREE.Float32BufferAttribute(aT, 1))
  aGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(aS, 1))
  aGeo.setIndex(aIdx)
  globe.add(new THREE.LineSegments(aGeo, track(new THREE.ShaderMaterial({
    vertexShader: trailVert,
    fragmentShader: trailFrag,
    uniforms: { uTime: time, uSpeed: { value: 0.25 }, uLen: { value: 0.32 }, uBase: { value: 0.06 }, uColor: { value: HOT } },
    ...add,
  }))))

  // Orbits with satellites
  const orbits: THREE.Group[] = []
  const satGeo = track(new THREE.SphereGeometry(0.1, 10, 10))
  const satMat = track(new THREE.MeshBasicMaterial({ color: HOT, ...add }))
  ;[[R * 1.42, 1.1], [R * 1.7, -0.45]].forEach(([r, tilt]) => {
    const pivot = new THREE.Group()
    pivot.rotation.set(tilt!, 0, tilt! * 0.35)
    const sat = new THREE.Mesh(satGeo, satMat)
    sat.position.set(r!, 0, 0)
    pivot.add(new THREE.LineLoop(track(circle(r!)), flat(GOLD, 0.4)), sat)
    core.add(pivot)
    orbits.push(pivot)
  })

  // Scrolling price lines across the horizon
  const seg = small ? 160 : 460
  const xs = new Float32Array(seg)
  for (let i = 0; i < seg; i++) xs[i] = (i / (seg - 1) - 0.5) * 92
  const pGeo = track(new THREE.BufferGeometry())
  pGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(seg * 3), 3))
  pGeo.setAttribute('aX', new THREE.BufferAttribute(xs, 1))
  ;(small ? [[0, -1.6, -20, GOLD]] : [[0, -1.2, -22, GOLD], [1, 1.6, -30, AMBER], [2, -3.2, -36, GOLD]]).forEach(([s, y, z, c]) => {
    const line = new THREE.Line(pGeo, track(new THREE.ShaderMaterial({
      vertexShader: priceVert,
      fragmentShader: priceFrag,
      uniforms: { uTime: time, uSeed: { value: s }, uColor: { value: c }, uHot: { value: HOT } },
      ...add,
    })))
    line.position.set(0, y as number, z as number)
    line.frustumCulled = false
    scene.add(line)
  })

  // Rising data streams
  const streams = small ? 24 : 90
  const sPos: number[] = []
  const sT: number[] = []
  const sS: number[] = []
  for (let i = 0; i < streams; i++) {
    const side = Math.random() > 0.5 ? 1 : -1
    const x = side * (small ? 5 + Math.random() * 8 : 8 + Math.random() * 32)
    const z = -6 - Math.random() * (small ? 14 : 46)
    const len = 5 + Math.random() * 12
    const seed = Math.random()
    sPos.push(x, -4, z, x, -4 + len, z)
    sT.push(0, 1)
    sS.push(seed, seed)
  }
  const sGeo = track(new THREE.BufferGeometry())
  sGeo.setAttribute('position', new THREE.Float32BufferAttribute(sPos, 3))
  sGeo.setAttribute('aT', new THREE.Float32BufferAttribute(sT, 1))
  sGeo.setAttribute('aSeed', new THREE.Float32BufferAttribute(sS, 1))
  const streamLines = new THREE.LineSegments(sGeo, track(new THREE.ShaderMaterial({
    vertexShader: trailVert,
    fragmentShader: trailFrag,
    uniforms: { uTime: time, uSpeed: { value: 0.4 }, uLen: { value: 0.45 }, uBase: { value: 0 }, uColor: { value: GOLD } },
    ...add,
  })))
  streamLines.frustumCulled = false
  scene.add(streamLines)

  // Floating currency symbols
  const textures = GLYPHS.map(g => track(glyphTexture(g)))
  const sprites = Array.from({ length: small ? 8 : 22 }, (_, i) => {
    const mat = track(new THREE.SpriteMaterial({ map: textures[i % textures.length], color: 0xffffff, ...add, opacity: 0 }))
    const sp = new THREE.Sprite(mat)
    const side = i % 2 ? 1 : -1
    const data = { x: side * (small ? 4.5 + Math.random() * 6 : 7 + Math.random() * 22), y: -4 + Math.random() * 18, z: -8 - Math.random() * (small ? 10 : 30), v: 0.5 + Math.random() * 0.8, s: 0.9 + Math.random() * 1.4 }
    sp.scale.setScalar(data.s)
    scene.add(sp)
    return { sp, mat, data }
  })
  const placeSprites = (t: number) => {
    sprites.forEach(({ sp, mat, data }) => {
      const y = ((data.y + t * data.v) % 20) - 4
      sp.position.set(data.x + Math.sin(t * 0.5 + data.z) * 0.6, y, data.z)
      mat.opacity = Math.sin(((y + 4) / 20) * Math.PI) * 0.55
    })
  }

  const target = new THREE.Vector2()
  const look = small ? new THREE.Vector3(0, 2.2, -10) : new THREE.Vector3(0, 2.4, -12)
  const onPointer = (e: PointerEvent) => {
    target.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1))
  }
  addEventListener('pointermove', onPointer, { passive: true })
  const ptr = tMat.uniforms.uPointer!.value as THREE.Vector2

  let raf = 0
  let visible = true
  let last = performance.now()
  let t = 6
  let born = 0
  // Cached once per layout instead of reading the DOM every frame, which forced a
  // synchronous reflow at 60fps on a full-screen element.
  let heroTop = 0
  let heroH = 1
  const measure = () => {
    heroTop = el.getBoundingClientRect().top + window.scrollY
    heroH = Math.max(el.clientHeight, 1)
  }

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    if (!born) born = now
    if (!calm) t += dt
    time.value = t
    const ease = 1 - Math.exp(-dt * 2.5)
    if (touch) target.set(Math.sin(t * 0.35) * 0.6, Math.cos(t * 0.27) * 0.3)
    ptr.lerp(target, ease)

    // Push-in on first paint, so the scene arrives with the headline instead of popping
    const enter = calm ? 1 : 1 - (1 - Math.min((now - born) / 1900, 1)) ** 3
    core.scale.setScalar(0.88 + 0.12 * enter)

    const scroll = Math.min(Math.max((window.scrollY - heroTop) / heroH, 0), 1)
    camera.position.x += (target.x * 2 - camera.position.x) * ease
    camera.position.y += (CAM.y + target.y - scroll * 3 - camera.position.y) * ease
    camera.position.z = CAM.z + 9 * (1 - enter)
    camera.lookAt(look)
    globe.rotation.y = t * 0.09
    core.rotation.y = target.x * 0.12
    core.rotation.x = -target.y * 0.06
    orbits.forEach((o, i) => { o.rotation.y = t * (i ? 0.17 : 0.27) })
    placeSprites(t)
    renderer.render(scene, camera)
  }

  const resize = () => {
    const w = el.clientWidth
    const h = el.clientHeight
    // Cap total pixels: a 1.75x buffer on a 4K screen is millions of wasted fragments
    const budget = small ? 1.4e6 : 3.4e6
    const ratio = Math.min(devicePixelRatio, small ? 1 : 1.75, Math.sqrt(budget / Math.max(w * h, 1)))
    renderer.setPixelRatio(Math.max(0.75, ratio))
    renderer.setSize(w, h, false)
    camera.aspect = w / Math.max(h, 1)
    camera.fov = camera.aspect < 0.8 ? 72 : 52
    camera.updateProjectionMatrix()
    measure()
    if (calm) frame(performance.now())
  }
  const ro = new ResizeObserver(resize)
  ro.observe(el)

  let drawn = 0
  const loop = (now: number) => {
    if (!small || now - drawn >= 30) {
      drawn = now
      frame(now)
    }
    raf = visible && !document.hidden ? requestAnimationFrame(loop) : 0
  }
  const start = () => {
    if (calm || raf) return
    last = performance.now()
    raf = requestAnimationFrame(loop)
  }

  const io = new IntersectionObserver(([e]) => {
    visible = !!e?.isIntersecting
    if (visible) start()
  })
  io.observe(el)
  const onVis = () => { if (!document.hidden) start() }
  document.addEventListener('visibilitychange', onVis)

  resize()
  frame(performance.now())
  start()
  requestAnimationFrame(() => { ready.value = true })

  cleanup = () => {
    cancelAnimationFrame(raf)
    io.disconnect()
    ro.disconnect()
    removeEventListener('pointermove', onPointer)
    document.removeEventListener('visibilitychange', onVis)
    disposables.forEach(d => d.dispose())
    renderer.dispose()
    renderer.domElement.remove()
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <div ref="host" class="scene" :data-ready="ready || undefined" aria-hidden="true" />
</template>

<style scoped>
.scene { position: absolute; inset: 0; opacity: 0; transition: opacity 1600ms var(--ease-out); }
.scene[data-ready] { opacity: 1; }
.scene :deep(canvas) { inline-size: 100%; block-size: 100%; }
</style>
