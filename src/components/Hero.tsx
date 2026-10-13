import { useEffect, useRef } from 'react'
import { animate, stagger } from 'animejs'
import AsciiHands from './AsciiHands'
import { profile } from '../data/content'

export default function Hero() {
  const title = useRef<HTMLHeadingElement>(null)
  useEffect(() => {
    animate(title.current!.querySelectorAll('span'), { opacity: [0, 1], translateY: [24, 0], duration: 1200, delay: stagger(40), ease: 'outExpo' })
    animate('.fade-in', { opacity: [0, 1], duration: 1600, delay: 900, ease: 'outQuad' })
  }, [])
  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center gap-10 px-6 pt-20">
      <AsciiHands className="max-w-[1500px]" />
      <div className="text-center">
        <h1 ref={title} className="font-serif text-[clamp(2.75rem,8vw,7rem)] leading-none tracking-tight">
          {profile.name.split('').map((c, i) => <span key={i} className="inline-block opacity-0">{c === ' ' ? '\u00A0' : c}</span>)}
        </h1>
        <p className="fade-in mt-5 text-[11px] tracking-[0.35em] uppercase text-bone/60 opacity-0">{profile.role} · {profile.tagline}</p>
      </div>
    </section>
  )
}
