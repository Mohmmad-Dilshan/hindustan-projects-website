import { motion } from 'framer-motion'
import { Container } from '@/components/ui'
import { useCountUp } from '@/hooks/useCountUp'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'

const STATS = [
  { value: 50, suffix: '+', label: 'Projects Delivered' },
  { value: 40, suffix: '+', label: 'Happy Clients' },
  { value: 5,  suffix: '+', label: 'Years Experience' },
  { value: 3,  suffix: '+', label: 'Cities Served' },
]

function StatItem({ value, suffix = '', label }) {
  const { count, ref } = useCountUp(value)
  return (
    <motion.div ref={ref} variants={fadeUp} className="text-center group">
      <p className="font-heading text-5xl md:text-6xl font-bold text-white transition-all duration-300 group-hover:scale-105">
        {count}
        <span className="text-brand-red-light">{suffix}</span>
      </p>
      <p className="mt-3 text-[10px] md:text-xs text-white/70 font-bold tracking-widest uppercase">{label}</p>
    </motion.div>
  )
}

export default function StatsSection() {
  return (
    <section className="py-16 relative overflow-hidden bg-brand-blue-dark border-y border-white/5">
      {/* Subtle glowing dark blue background accent */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none" 
        style={{
          background: 'radial-gradient(circle at 50% 50%, #1A3E8C 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
      {/* Tech Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <Container className="relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
        >
          {STATS.map((s) => (
            <StatItem key={s.label} {...s} />
          ))}
        </motion.div>
      </Container>
    </section>
  )
}
