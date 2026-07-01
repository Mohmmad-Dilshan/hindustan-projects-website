/**
 * /services — Premium full services listing page
 */
import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Code2, Megaphone, Lightbulb, Monitor, Settings, Layers, Smartphone, Zap, Shield, Clock, Users } from 'lucide-react'
import { Container, Button } from '@/components/ui'

/* ── Service data ─────────────────────────────────────────────── */
const SERVICES = [
  {
    id: '1',
    title: 'Web Development',
    slug: 'web-development',
    icon: Code2,
    color: 'from-blue-500 to-cyan-400',
    bgGlow: 'bg-blue-500/10',
    tag: 'Most Popular',
    features: ['React & Next.js', 'SEO Optimised', 'Mobile Responsive'],
    shortDescription: 'Custom, responsive websites built with modern technologies like React, Node.js, and WordPress — optimised for speed, SEO, and conversions.',
  },
  {
    id: '2',
    title: 'Digital Marketing & SEO',
    slug: 'digital-marketing-seo',
    icon: Megaphone,
    color: 'from-orange-500 to-rose-400',
    bgGlow: 'bg-orange-500/10',
    tag: 'High ROI',
    features: ['Google & Meta Ads', 'SEO & Content', 'Analytics Reports'],
    shortDescription: 'Result-driven digital marketing campaigns spanning SEO, Google Ads, Meta Ads, and content marketing to drive high-intent leads.',
  },
  {
    id: '3',
    title: 'IT Consulting & Strategy',
    slug: 'it-consulting-strategy',
    icon: Lightbulb,
    color: 'from-violet-500 to-purple-400',
    bgGlow: 'bg-violet-500/10',
    tag: 'Expert Advice',
    features: ['Tech Roadmap', 'System Architecture', 'Growth Planning'],
    shortDescription: 'Strategic IT advisory to align your technology roadmap with business growth. We help you choose the right systems and architecture.',
  },
  {
    id: '4',
    title: 'E-Commerce Solutions',
    slug: 'ecommerce-solutions',
    icon: Monitor,
    color: 'from-emerald-500 to-teal-400',
    bgGlow: 'bg-emerald-500/10',
    tag: 'Sell More',
    features: ['Secure Payments', 'Inventory Mgmt', 'Checkout Optimized'],
    shortDescription: 'End-to-end e-commerce store setup, checkout optimisation, inventory management systems, and secure payment gateway integrations.',
  },
  {
    id: '5',
    title: 'Cloud Solutions & DevOps',
    slug: 'cloud-solutions-devops',
    icon: Settings,
    color: 'from-sky-500 to-indigo-400',
    bgGlow: 'bg-sky-500/10',
    tag: 'Scalable',
    features: ['AWS & Google Cloud', 'CI/CD Pipelines', 'Zero Downtime'],
    shortDescription: 'Secure cloud hosting setup, AWS/Google Cloud management, server scaling, and continuous deployment workflows for zero downtime.',
  },
  {
    id: '6',
    title: 'Branding & UI/UX Design',
    slug: 'branding-ui-ux-design',
    icon: Layers,
    color: 'from-pink-500 to-rose-400',
    bgGlow: 'bg-pink-500/10',
    tag: 'Stand Out',
    features: ['Logo & Identity', 'UI/UX Prototypes', 'Brand Guidelines'],
    shortDescription: 'Premium user interface and user experience designs coupled with complete corporate brand identity systems, logos, and guidelines.',
  },
  {
    id: '7',
    title: 'Mobile App Development',
    slug: 'mobile-app-development',
    icon: Smartphone,
    color: 'from-amber-500 to-yellow-400',
    bgGlow: 'bg-amber-500/10',
    tag: 'iOS & Android',
    features: ['React Native', 'App Store Ready', 'High Performance'],
    shortDescription: 'Native and cross-platform mobile apps for iOS and Android built with React Native and Flutter — secure, high-performing, and App Store ready.',
  },
]

/* ── Why Us stats strip ───────────────────────────────────────── */
const WHY_STATS = [
  { icon: Zap, label: 'Fast Delivery', value: '2–4 Weeks' },
  { icon: Shield, label: 'Trusted & Secure', value: '100% Safe' },
  { icon: Clock, label: 'Support', value: '24/7 Available' },
  { icon: Users, label: 'Happy Clients', value: '50+ Businesses' },
]

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-[#050e20]">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
        {/* Gradient blobs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-brand-red/15 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <Container className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

            {/* Left — text */}
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-red/30 bg-brand-red/10 text-brand-red text-xs font-semibold uppercase tracking-widest mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-red animate-pulse" />
                What We Offer
              </span>
              <h1 className="font-heading text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white leading-tight mb-5">
                Expert IT Services{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-400">
                  Built for Growth
                </span>
              </h1>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-8">
                From custom web apps to cloud infrastructure — we deliver end-to-end
                technology solutions that help businesses in Bhilwara and across India
                grow faster online.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary" size="lg" as={Link} to="/contact">
                  Get a Free Consultation
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  as={Link}
                  to="/portfolio"
                  className="!text-white !border-white/20 hover:!bg-white/10"
                >
                  View Our Work
                </Button>
              </div>
            </div>

            {/* Right — service tags in 2-col grid */}
            <div className="hidden lg:grid grid-cols-2 gap-2.5">
              {SERVICES.map((s, i) => (
                <div
                  key={s.id}
                  style={{ animationDelay: `${i * 0.08}s` }}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:border-white/25 hover:bg-white/10 transition-all duration-300"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                    <s.icon className="w-4 h-4 text-white" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm text-white/80 font-medium">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Why Us Stats Strip ──────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100 py-0">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-100">
            {WHY_STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 px-6 py-5 group hover:bg-brand-blue/3 transition-colors duration-200">
                <div className="w-10 h-10 rounded-xl bg-brand-blue/8 flex items-center justify-center shrink-0 group-hover:bg-brand-blue/14 transition-colors">
                  <stat.icon className="w-5 h-5 text-brand-blue" strokeWidth={1.8} />
                </div>
                <div>
                  <p className="text-base font-bold text-brand-blue font-heading">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Services Grid ────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-b from-gray-50/60 to-white">
        <Container>
          <div className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase text-brand-red">All Services</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-brand-blue mt-2 mb-3">
              Everything Your Business Needs
            </h2>
            <p className="text-text-muted max-w-xl mx-auto text-sm sm:text-base">
              Pick a single service or bundle them — we tailor every engagement to your goals and budget.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map((service, index) => (
              <Link
                key={service.id}
                to={`/services/${service.slug}`}
                className={`group relative bg-white rounded-2xl border border-gray-100 p-7 flex flex-col
                  hover:border-transparent hover:shadow-[0_12px_40px_rgba(26,62,140,0.12)]
                  hover:-translate-y-1.5 transition-all duration-300 overflow-hidden
                  ${index === SERVICES.length - 1 && SERVICES.length % 3 !== 0 ? 'sm:col-span-2 lg:col-span-1' : ''}
                  ${index === SERVICES.length - 1 && SERVICES.length % 3 === 1 ? 'lg:col-start-2' : ''}`}
              >
                {/* Subtle glow on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl ${service.bgGlow}`} />

                {/* Top row: number + tag */}
                <div className="relative flex items-center justify-between mb-5">
                  <span className="text-[11px] font-bold text-text-muted/50 font-mono tracking-widest">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${service.color} text-white shadow-sm`}>
                    {service.tag}
                  </span>
                </div>

                {/* Icon */}
                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <service.icon className="w-7 h-7 text-white" strokeWidth={1.6} />
                </div>

                {/* Title */}
                <h2 className="relative font-heading text-lg font-bold text-brand-blue mb-2 group-hover:text-brand-blue">
                  {service.title}
                </h2>

                {/* Description */}
                <p className="relative text-sm text-text-muted leading-relaxed flex-1 mb-5">
                  {service.shortDescription}
                </p>

                {/* Feature tags */}
                <div className="relative flex flex-wrap gap-2 mb-5">
                  {service.features.map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1 text-[11px] font-medium px-2.5 py-1
                        rounded-full bg-gray-50 text-text-muted border border-gray-100
                        group-hover:border-gray-200 transition-colors"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA link */}
                <div className="relative flex items-center gap-1.5 text-sm font-semibold text-brand-red group-hover:gap-3 transition-all duration-200">
                  Explore Service
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Process teaser strip ─────────────────────────────────── */}
      <section className="py-16 bg-white border-t border-gray-100">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-lg">
              <span className="text-xs font-semibold tracking-widest uppercase text-brand-red">How It Works</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-brand-blue mt-2 mb-3">
                From Idea to Launch — In 4 Simple Steps
              </h2>
              <p className="text-text-muted text-sm leading-relaxed">
                Our proven process ensures every project is delivered on time, within budget,
                and built to scale.
              </p>
            </div>
            <div className="flex gap-4 flex-wrap md:flex-nowrap shrink-0">
              {['Discovery', 'Planning', 'Execution', 'Delivery'].map((step, i) => (
                <div key={step} className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-full border-2 border-brand-blue/20 bg-brand-blue/5
                    flex items-center justify-center font-heading font-bold text-brand-blue text-lg
                    hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all duration-300 cursor-default">
                    {i + 1}
                  </div>
                  <span className="text-xs font-medium text-text-muted whitespace-nowrap">{step}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────────── */}
      <section className="relative py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-[#1e3a7a] to-[#0a1f5c]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:30px_30px]" />
        {/* Blobs */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl" />

        <Container className="relative">
          <div className="max-w-3xl mx-auto text-center text-white">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 bg-white/5 text-white/70 text-xs font-semibold uppercase tracking-widest mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Free Consultation Available
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4 leading-tight">
              <span className="text-white">Not Sure Which Service to Choose?</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red to-orange-400">
                We'll Guide You.
              </span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-10 max-w-xl mx-auto">
              Tell us about your business — our experts will suggest the perfect service package
              tailored to your goals and budget. No commitment required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg" as={Link} to="/contact">
                Book a Free Call
              </Button>
              <Button
                variant="ghost"
                size="lg"
                as={Link}
                to="/portfolio"
                className="!text-white !border-white/25 hover:!bg-white/10"
              >
                See Our Portfolio →
              </Button>
            </div>

            {/* Trust row */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/40 text-xs font-medium">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> No upfront payment</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> Reply within 24 hours</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-green-400" /> 50+ happy clients</span>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
