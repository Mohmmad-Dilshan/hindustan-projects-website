import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Container, SectionHeading } from '@/components/ui'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { fadeUp, staggerContainer, viewportOnce } from '@/utils/motion'

const FAQS = [
  {
    question: 'How long does it take to design and develop a custom website?',
    answer: 'For a standard corporate website, it usually takes between 3 to 4 weeks from discovery to launch. For complex e-commerce stores or custom web portals with ERP integrations, it might take 6 to 8 weeks. We provide clear phase-wise timelines at project start.',
  },
  {
    question: 'Do you provide support and maintenance post-launch?',
    answer: 'Absolutely. Every project we launch comes with 30 days of complimentary support for bug fixes and training. After that, we offer flexible, dedicated annual maintenance plans (SLA) to handle server updates, security checks, content updates, and SEO audits.',
  },
  {
    question: 'Will my website be mobile-friendly and optimized for Google (SEO)?',
    answer: 'Yes, 100%. Every single layout is coded using responsive styling, ensuring it looks pixel-perfect on iPhones, Androids, tablets, and wide screens. We also implement code-level SEO best practices (schema markup, semantic tags, fast page load setups) to ensure high visibility on Google.',
  },
  {
    question: 'What are your payment terms and engagement models?',
    answer: 'Typically, we structure payments in milestones: 30% initial deposit, 40% upon design approval, and 30% upon final delivery/testing prior to launch. We also offer dedicated monthly retainer models for ongoing marketing and software support.',
  },
]

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <div className="border border-black/5 bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-200">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-5 text-left font-heading text-sm sm:text-base font-bold text-brand-blue hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-3">
          <HelpCircle className="w-4 h-4 text-brand-red-light shrink-0" />
          {question}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-brand-blue/40 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180 text-brand-red-light' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            <div className="p-5 pt-0 text-sm text-text-muted leading-relaxed border-t border-gray-100/50 bg-gray-50/20">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="py-20 bg-bg-base border-t border-gray-100" aria-labelledby="faq-heading">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Heading and info */}
          <div className="lg:col-span-5">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              variants={fadeUp}
              className="sticky top-28"
            >
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-red">
                Got Questions?
              </span>
              <h2
                id="faq-heading"
                className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mt-3 mb-4"
              >
                Frequently Asked <span className="text-brand-red">Questions</span>
              </h2>
              <p className="text-text-muted text-sm leading-relaxed max-w-sm">
                Can&apos;t find the answer you&apos;re looking for? Reach out directly via our contact form or give us a call — our tech advisors are happy to help!
              </p>
            </motion.div>
          </div>

          {/* Right Column: Accordion list */}
          <div className="lg:col-span-7">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="space-y-4"
            >
              {FAQS.map((faq, idx) => (
                <motion.div key={faq.question} variants={fadeUp}>
                  <FaqItem
                    question={faq.question}
                    answer={faq.answer}
                    isOpen={openIndex === idx}
                    onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  )
}
