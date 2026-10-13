import { useEffect } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Contact from './components/Contact'

export default function App() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.1 })
    let id = requestAnimationFrame(function raf(t) { lenis.raf(t); id = requestAnimationFrame(raf) })
    return () => { cancelAnimationFrame(id); lenis.destroy() }
  }, [])
  return (
    <main className="grain">
      <Hero /><About /><Projects /><Skills /><Contact />
    </main>
  )
}
