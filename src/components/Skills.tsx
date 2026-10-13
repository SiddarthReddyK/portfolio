import Section from './Section'
import AsciiCanvas from './AsciiCanvas'
import { skills } from '../data/content'
export default function Skills() {
  return (
    <div className="bg-deep">
      <Section id="skills" index="03" title="Skills" className="!pb-0">
        <div className="grid items-center gap-12 md:grid-cols-[1fr_380px]">
          <div className="grid gap-10 sm:grid-cols-2">
            {Object.entries(skills).map(([group, items]) => (
              <div key={group}><h3 className="font-serif text-3xl">{group}</h3><p className="mt-3 text-sm leading-7 text-bone/75">{items.join('  /  ')}</p></div>
            ))}
          </div>
          {/* whole shark visible: portrait box, contain fit, no cropping */}
          <AsciiCanvas src="/shark.jpg" cell={6} gain={1.8} tint="#9fd0ff" className="mx-auto aspect-[2/3] w-full max-w-[380px]" />
        </div>
        <p className="mt-6 text-[11px] tracking-[0.3em] text-bone/40">NOISE → SIGNAL</p>
      </Section>
      <div className="h-24" />
    </div>
  )
}
