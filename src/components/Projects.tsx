import Section from './Section'
import { projects } from '../data/content'
export default function Projects() {
  return <Section id="projects" index="02" title="Projects">
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map(p => (
        <a key={p.file} href={p.href} target="_blank" rel="noreferrer" className="group block border border-bone/30 hover:border-bone transition-colors">
          <div className="flex items-center justify-between border-b border-bone/30 px-3 py-1 text-[10px] tracking-widest">
            <span>{p.file.toUpperCase()}</span><span>_ ▫ ✕</span>
          </div>
          <div className="p-6">
            <h3 className="font-serif text-4xl">{p.title}</h3>
            <p className="mt-3 text-sm text-bone/70">{p.blurb}</p>
            <p className="mt-6 text-xs text-bone/50">{p.stack.join(' · ')}</p>
          </div>
        </a>
      ))}
    </div>
  </Section>
}
