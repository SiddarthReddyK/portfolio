import Section from './Section'
import { profile } from '../data/content'
export default function Contact() {
  return <Section id="contact" index="04" title="Contact">
    <p className="font-serif text-4xl md:text-6xl">Let's build something.</p>
    <div className="mt-10 flex flex-wrap gap-8 text-sm">
      {profile.links.map(l => <a key={l.label} href={l.href} className="underline underline-offset-8 decoration-bone/30 hover:decoration-bone">{l.label} ↗</a>)}
    </div>
    <p className="mt-24 text-xs text-bone/40">© 2026 {profile.name} · {profile.altName}</p>
  </Section>
}
