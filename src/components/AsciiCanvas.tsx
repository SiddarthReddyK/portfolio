import { useEffect, useRef } from 'react'

// Renders an image as ASCII glyphs. mode "hands" splits the image at the centre and
// slides each half toward the other (progress 0..1, driven by cursor/scroll).
type Props = { src: string; mode?: 'hands' | 'plain'; cell?: number; tint?: string; className?: string }
const RAMP = ' .:-=+*#%@01SX8'

export default function AsciiCanvas({ src, mode = 'plain', cell = 9, tint = '#e8e6e1', className }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = ref.current!, ctx = canvas.getContext('2d')!
    const img = new Image(); img.src = src
    const off = document.createElement('canvas'), octx = off.getContext('2d', { willReadFrequently: true })!
    let cols = 0, rows = 0, data: Uint8ClampedArray | null = null, raf = 0
    let target = 0.15, prog = 0.15, t0 = performance.now()
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches

    const layout = () => {
      const w = canvas.clientWidth, h = canvas.clientHeight, dpr = Math.min(devicePixelRatio, 2)
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(w / (cell * 0.62)); rows = Math.floor(h / cell)
      off.width = cols; off.height = rows
      // cover-fit the image into the grid
      const s = Math.max(cols / img.width, rows / img.height)
      octx.fillStyle = '#000'; octx.fillRect(0, 0, cols, rows)
      octx.drawImage(img, (cols - img.width * s) / 2, (rows - img.height * s) / 2, img.width * s, img.height * s)
      data = octx.getImageData(0, 0, cols, rows).data
    }
    const draw = (now: number) => {
      if (!data) return
      prog += (target - prog) * 0.06
      const w = canvas.clientWidth, h = canvas.clientHeight
      ctx.clearRect(0, 0, w, h)
      ctx.font = `${cell}px "JetBrains Mono", monospace`; ctx.textBaseline = 'top'; ctx.fillStyle = tint
      const shift = Math.round(prog * cols * 0.18), mid = cols / 2, tt = (now - t0) / 1000
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        let sx = x
        if (mode === 'hands') sx = x < mid ? x - shift : x + shift   // left half moves right, right half moves left
        if (sx < 0 || sx >= cols) continue
        const i = (y * cols + sx) * 4, v = (data[i] + data[i + 1] + data[i + 2]) / 765
        if (v < 0.08) continue
        // gentle shimmer: brightness picks the glyph, time nudges it
        const k = Math.min(RAMP.length - 1, Math.floor(v * RAMP.length + (reduce ? 0 : Math.sin(tt * 2 + x * 0.3 + y * 0.5) * 0.9)))
        ctx.globalAlpha = 0.35 + v * 0.65
        ctx.fillText(RAMP[Math.max(1, k)], x * cell * 0.62, y * cell)
      }
      raf = requestAnimationFrame(draw)
    }
    const onMove = (e: PointerEvent) => { target = Math.min(1, 0.15 + (e.clientX / innerWidth) * 0.4 + (1 - e.clientY / innerHeight) * 0.4) }
    const onScroll = () => { target = Math.min(1, 0.15 + scrollY / (innerHeight * 0.9)) }
    img.onload = () => { layout(); raf = requestAnimationFrame(draw) }
    addEventListener('resize', layout); addEventListener('pointermove', onMove); addEventListener('scroll', onScroll)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', layout); removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll) }
  }, [src, mode, cell, tint])
  return <canvas ref={ref} className={className} />
}
