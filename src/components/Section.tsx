import { useEffect, useRef, type ReactNode } from 'react'
import { animate } from 'animejs'
export default function Section({ id, index, title, children, className = '' }: { id: string; index: string; title: string; children: ReactNode; className?: string }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { animate(el.current!, { opacity: [0, 1], translateY: [40, 0], duration: 1100, ease: 'outExpo' }); io.disconnect() } }, { threshold: 0.15 })
    io.observe(el.current!); return () => io.disconnect()
  }, [])
  return (
    <section id={id} className={`relative px-6 md:px-16 py-32 ${className}`}>
      <div ref={el} className="opacity-0 mx-auto max-w-5xl">
        <p className="text-xs tracking-[0.3em] text-bone/50">{index} / {title.toUpperCase()}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  )
}
