import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Container, SectionHeading, Card } from '@/components/ui'
import { Star, ChevronLeft, ChevronRight } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'
import { useTestimonials } from '@/hooks/useTestimonials'

// Fallback while loading or if DB empty
const PLACEHOLDER = [
  {
    id: '1', name: 'Aditya Sharma', role: 'Managing Director', company: 'Bhilwara Textiles Ltd.',
    text: 'Hindustan Projects completely modernized our operations with their custom ERP and corporate portal. Their local availability combined with world-class engineering standard was exactly what we needed.',
    rating: 5,
  },
  {
    id: '2', name: 'Meera Johar', role: 'Founder & CEO', company: 'Jaipur Crafts E-Store',
    text: 'Dilshan and his team built our custom e-commerce platform and optimized our checkout flow. Within 3 months of launch, our conversion rates jumped by 42%.',
    rating: 5,
  },
  {
    id: '3', name: 'Rajesh Singhal', role: 'Owner', company: 'Singhal Marbles & Granites',
    text: 'We tried multiple marketing agencies but got zero leads. Hindustan Projects designed a targeted SEO and Google Ads strategy. Today we get 15+ high-quality inquiries every week.',
    rating: 5,
  },
]

function TestimonialCard({ t }) {
  const initials = t.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <Card className="p-7 h-full flex flex-col justify-between border border-gray-100 shadow-sm
      hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white">
      <div>
        {/* Stars */}
        <div className="flex gap-1 mb-4 text-amber-500">
          {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-current" />
          ))}
        </div>
        <p className="text-sm text-text-muted leading-relaxed italic mb-6">
          &ldquo;{t.text}&rdquo;
        </p>
      </div>
      <div className="flex items-center gap-3.5 border-t border-gray-100 pt-5 mt-auto">
        {t.avatarUrl ? (
          <img src={t.avatarUrl} alt={t.name}
            className="w-10 h-10 rounded-full object-cover shrink-0" loading="lazy" />
        ) : (
          <div className="w-10 h-10 rounded-full bg-brand-blue/8 flex items-center
            justify-center font-heading text-xs font-bold text-brand-blue shrink-0">
            {initials}
          </div>
        )}
        <div>
          <h4 className="font-heading text-sm font-bold text-brand-blue">{t.name}</h4>
          <p className="text-[11px] text-text-muted">
            {t.role}, <span className="font-semibold text-brand-red">{t.company}</span>
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function TestimonialsSection() {
  const { data, isLoading } = useTestimonials()
  const testimonials = data?.data?.length ? data.data : (isLoading ? [] : PLACEHOLDER)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(3)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1)
      } else if (window.innerWidth < 1024) {
        setItemsPerView(2)
      } else {
        setItemsPerView(3)
      }
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const maxIndex = Math.max(0, testimonials.length - itemsPerView)

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  return (
    <section className="py-20 bg-white" aria-labelledby="testimonials-heading">
      <Container>
        {/* Header with Navigation arrows */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce} variants={fadeUp} className="max-w-2xl">
            <SectionHeading
              id="testimonials-heading"
              eyebrow="Success Stories"
              title="What Our Clients Say"
              subtitle="Don't just take our word for it. Hear from the business owners who trust us with their growth."
              className="mb-0"
            />
          </motion.div>

          {maxIndex > 0 && (
            <div className="flex gap-2.5 shrink-0">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="w-11 h-11 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-brand-blue hover:text-brand-blue disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm active:scale-95 cursor-pointer"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Viewport */}
        <div className="relative overflow-hidden py-4 -mx-3 px-3">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
              width: `${(testimonials.length / itemsPerView) * 100}%`
            }}
          >
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="px-3" style={{ width: `${100 / itemsPerView}%` }}>
                  <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              ))
            ) : (
              testimonials.map(t => (
                <div
                  key={t.id}
                  className="px-3 flex-shrink-0"
                  style={{ width: `${100 / testimonials.length}%` }}
                >
                  <TestimonialCard t={t} />
                </div>
              ))
            )}
          </div>
        </div>

        {/* Bullet Indicators */}
        {maxIndex > 0 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  currentIndex === idx ? 'w-8 bg-brand-blue' : 'w-2 bg-gray-200 hover:bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  )
}
