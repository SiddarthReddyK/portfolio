import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import AsciiCanvas from './AsciiCanvas'
import { profile } from '../data/content'

export default function Hero() {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    animate(title.current!.querySelectorAll('span'), { opacity: [0, 1], translateY: [24, 0], duration: 1200, delay: stagger(45), ease: 'outExpo' })
    animate('.fade-in', { opacity: [0, 1], duration: 1600, delay: 900, ease: 'outQuad' })
  }, [])
  return (
    <section className="relative h-screen overflow-hidden">
      <AsciiCanvas src="/hands.jpg" mode="hands" cell={10} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-[12vh] text-center pointer-events-none">
        <h1 ref={title} className="font-serif text-[clamp(3rem,10vw,9rem)] leading-none tracking-tight">
          {profile.name.split('').map((c, i) => <span key={i} className="inline-block opacity-0">{c === ' ' ? '\u00A0' : c}</span>)}
        </h1>
        <p className="fade-in opacity-0 mt-4 text-xs tracking-[0.35em] uppercase text-bone/70">{profile.role} · {profile.tagline}</p>
      </div>
    </section>
  )
}
