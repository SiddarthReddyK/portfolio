import { profile } from '../data/content'
const links = ['about', 'projects', 'skills', 'contact']
export default function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-40 flex items-center justify-between px-6 md:px-16 py-5 text-[11px] tracking-[0.25em] uppercase mix-blend-difference">
      <a href="#top">{profile.name}</a>
      <nav className="flex gap-6 md:gap-10">{links.map(l => <a key={l} href={`#${l}`} className="opacity-60 hover:opacity-100 transition-opacity">{l}</a>)}</nav>
    </header>
  )
}
