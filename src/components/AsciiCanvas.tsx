import { useEffect, useRef } from 'react'

// Renders an image as ASCII glyphs.
// crop: [x,y,w,h] as 0..1 fractions of the source image (the part we want to show)
// fit "contain" keeps the whole crop visible, "cover" fills the box
// mode "hands": the left half slides right and the right half slides left (driven by cursor/scroll)
type Props = {
  src: string; mode?: 'hands' | 'plain'; cell?: number; tint?: string; className?: string
  crop?: [number, number, number, number]; fit?: 'contain' | 'cover'; gain?: number
}
const RAMP = ' .:-=+*#%@01SX8'

export default function AsciiCanvas({ src, mode = 'plain', cell = 7, tint = '#e8e6e1', className, crop = [0, 0, 1, 1], fit = 'contain', gain = 1.3 }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!, ctx = canvas.getContext('2d')!
    const img = new Image(); img.src = src
    const off = document.createElement('canvas'), octx = off.getContext('2d', { willReadFrequently: true })!
    octx.imageSmoothingQuality = 'high'
    let cols = 0, rows = 0, data: Uint8ClampedArray | null = null, raf = 0
    let target = 0, prog = 0; const t0 = performance.now()
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const layout = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio, 2)
      if (!w || !h) return
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(w / (cell * 0.62)); rows = Math.floor(h / cell)
      off.width = cols; off.height = rows
      const sx = crop[0] * img.width, sy = crop[1] * img.height, sw = crop[2] * img.width, sh = crop[3] * img.height
      const s = (fit === 'contain' ? Math.min : Math.max)(cols / sw, rows / sh)
      octx.fillStyle = '#000'; octx.fillRect(0, 0, cols, rows)
      octx.drawImage(img, sx, sy, sw, sh, (cols - sw * s) / 2, (rows - sh * s) / 2, sw * s, sh * s)
      data = octx.getImageData(0, 0, cols, rows).data
    }
    const draw = (now: number) => {
      if (data) {
        prog += (target - prog) * 0.06
        const w = canvas.clientWidth, h = canvas.clientHeight
        ctx.clearRect(0, 0, w, h)
        ctx.font = `${cell}px "JetBrains Mono", monospace`; ctx.textBaseline = 'top'; ctx.fillStyle = tint
        const shift = Math.round(prog * cols * 0.1), mid = cols / 2, tt = (now - t0) / 1000
        for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
          const sx = mode === 'hands' ? (x < mid ? x - shift : x + shift) : x
          if (sx < 0 || sx >= cols) continue
          const i = (y * cols + sx) * 4, v = Math.min(1, ((data[i] + data[i + 1] + data[i + 2]) / 765) * gain)
          if (v < 0.1) continue
          const k = Math.floor(v * (RAMP.length - 1) + (reduce ? 0 : Math.sin(tt * 1.6 + x * 0.3 + y * 0.5) * 0.7))
          ctx.globalAlpha = 0.3 + v * 0.7
          ctx.fillText(RAMP[Math.min(RAMP.length - 1, Math.max(1, k))], x * cell * 0.62, y * cell)
        }
      }
      raf = requestAnimationFrame(draw)
    }
    const onMove = (e: PointerEvent) => { target = Math.min(1, (e.clientX / innerWidth) * 0.6 + (1 - e.clientY / innerHeight) * 0.4) }
    const onScroll = () => { target = Math.min(1, scrollY / (innerHeight * 0.8)) }
    img.onload = () => { layout(); raf = requestAnimationFrame(draw) }
    addEventListener('resize', layout); addEventListener('pointermove', onMove); addEventListener('scroll', onScroll)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', layout); removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll) }
  }, [src, mode, cell, tint, fit, gain, crop])
  return <canvas ref={ref} className={className} />
}
