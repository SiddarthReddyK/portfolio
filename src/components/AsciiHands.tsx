import { useEffect, useRef } from 'react'

// Draws the pre-made ASCII artwork (public/hands-ascii.json, exported from inascii.com and cleaned).
// Layers: window frame (fixed) -> hands (left hand slides right, right hand slides left).
// Hand glyphs are drawn over the frame, so fingertips reach "into" the window.
type Art = { cols: number; rows: number; frame: { x: number; y: number; w: number; h: number; title: string }; chars: string[]; lum: string[]; hand: string[] }
const ASPECT = 0.6 // glyph width / height for the mono font

export default function AsciiHands({ className = '', tint = '232,230,225' }: { className?: string; tint?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!, ctx = canvas.getContext('2d')!
    let art: Art | null = null, raf = 0, target = 0, prog = 0, grid: string[][] = [], lumGrid: number[][] = []
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const size = () => {
      if (!art) return
      const w = canvas.clientWidth, dpr = Math.min(devicePixelRatio, 2)
      const cw = w / art.cols, chh = cw / ASPECT
      canvas.width = w * dpr; canvas.height = art.rows * chh * dpr; canvas.style.height = `${art.rows * chh}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const compose = (shift: number) => {
      const a = art!, { x: fx, y: fy, w: fw, h: fh } = a.frame
      grid = Array.from({ length: a.rows }, () => Array(a.cols).fill(' ')); lumGrid = Array.from({ length: a.rows }, () => Array(a.cols).fill(0))
      const put = (x: number, y: number, c: string, l = 235) => { if (x >= 0 && x < a.cols && y >= 0 && y < a.rows) { grid[y][x] = c; lumGrid[y][x] = l } }
      for (let x = 0; x < fw; x++) { put(fx + x, fy, '-'); put(fx + x, fy + 2, '-'); put(fx + x, fy + fh - 1, '-') }
      for (let y = 0; y < fh; y++) { put(fx, fy + y, '|'); put(fx + fw - 1, fy + y, '|') }
      for (const [x, y] of [[0, 0], [fw - 1, 0], [0, fh - 1], [fw - 1, fh - 1], [0, 2], [fw - 1, 2]]) put(fx + x, fy + y, '+')
      ;[...a.frame.title].forEach((c, i) => put(fx + 3 + i, fy + 1, c))
      ;[...'[_] [o] [x]'].forEach((c, i) => put(fx + fw - 14 + i, fy + 1, c))
      for (let y = 0; y < a.rows; y++) for (let x = 0; x < a.cols; x++) {
        const l = a.hand[y][x]; if (l === '0') continue
        put(l === '1' ? x + shift : x - shift, y, a.chars[y][x], parseInt(a.lum[y].substr(x * 2, 2), 16))
      }
    }
    const draw = () => {
      if (art) {
        prog += (target - prog) * 0.06
        compose(Math.round(prog * 12))
        const w = canvas.clientWidth, cw = w / art.cols, chh = cw / ASPECT
        ctx.clearRect(0, 0, w, art.rows * chh)
        ctx.font = `${chh * 0.98}px "JetBrains Mono", monospace`; ctx.textBaseline = 'top'
        for (let y = 0; y < art.rows; y++) for (let x = 0; x < art.cols; x++) {
          const c = grid[y][x]; if (c === ' ') continue
          ctx.fillStyle = `rgba(${tint},${Math.min(1, 0.25 + (lumGrid[y][x] / 255) * 1.1)})`
          ctx.fillText(c, x * cw, y * chh)
        }
      }
      raf = requestAnimationFrame(draw)
    }
    const onMove = (e: PointerEvent) => { if (!reduce) target = Math.min(1, (e.clientX / innerWidth) * 0.5 + (1 - e.clientY / innerHeight) * 0.5) }
    const onScroll = () => { if (!reduce) target = Math.min(1, scrollY / (innerHeight * 0.7)) }
    fetch('/hands-ascii.json').then(r => r.json()).then((j: Art) => { art = j; size(); raf = requestAnimationFrame(draw) })
    addEventListener('resize', size); addEventListener('pointermove', onMove); addEventListener('scroll', onScroll)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll) }
  }, [tint])
  return <canvas ref={ref} className={`block w-full ${className}`} />
}
