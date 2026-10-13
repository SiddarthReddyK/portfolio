import Section from './Section'
import AsciiCanvas from './AsciiCanvas'
import { skills } from '../data/content'
export default function Skills() {
  return (
    <div className="relative bg-deep">
      <AsciiCanvas src="/shark.jpg" cell={9} tint="#9fd0ff" className="absolute inset-0 h-full w-full opacity-40" />
      <Section id="skills" index="03" title="Skills · noise to signal" className="relative">
        <div className="grid gap-10 md:grid-cols-2">
          {Object.entries(skills).map(([group, items]) => (
            <div key={group}><h3 className="font-serif text-3xl">{group}</h3><p className="mt-3 text-sm text-bone/80 leading-7">{items.join('  /  ')}</p></div>
          ))}
        </div>
      </Section>
    </div>
  )
}
