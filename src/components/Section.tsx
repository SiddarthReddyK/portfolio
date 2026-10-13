import { useEffect, useRef, type ReactNode } from 'react'
import { animate } from 'animejs'
// Editorial layout: small index rail on the left, content on the right.
export default function Section({ id, index, title, children, className = '' }: { id: string; index: string; title: string; children: ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { animate(el.current!, { opacity: [0, 1], translateY: [32, 0], duration: 1000, ease: 'outExpo' }); io.disconnect() } }, { threshold: 0.12 })
    io.observe(el.current!); return () => io.disconnect()
  }, [])
  return (
    <section id={id} className={`relative px-6 md:px-16 py-24 md:py-32 ${className}`}>
      <div ref={el} className="opacity-0 mx-auto grid max-w-6xl gap-8 border-t border-bone/15 pt-8 md:grid-cols-[180px_1fr]">
        <p className="text-[11px] tracking-[0.3em] text-bone/50">{index} / {title.toUpperCase()}</p>
        <div>{children}</div>
      </div>
    </section>
  )
}
