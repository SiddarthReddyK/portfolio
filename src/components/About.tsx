import Section from './Section'
import { profile } from '../data/content'
export default function About() {
  return <Section id="about" index="01" title="About">
    <p className="font-serif text-3xl md:text-5xl leading-tight max-w-3xl">{profile.about}</p>
  </Section>
}
