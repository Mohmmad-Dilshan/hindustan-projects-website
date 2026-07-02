/**
 * Prisma seed script — run with: npx prisma db seed
 * Seeds 5 IT services for Hindustan Projects.
 * Full service data will be seeded in Phase 4.
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ── Services (with rich detail fields) ───────────────────────
  const services = [
    {
      title: 'Web Development', slug: 'web-development', icon: 'Globe', order: 1,
      tag: 'Most Popular', deliveryTime: '2–4 Weeks',
      shortDescription: 'Custom websites and web apps built with modern, scalable technology stacks.',
      fullDescription: 'We design and develop responsive, high-performance websites and web applications tailored to your business needs. From landing pages to full-stack enterprise platforms, our team delivers clean code, fast load times, and seamless user experiences.',
      techStack: ['React.js', 'Next.js', 'Node.js', 'WordPress', 'MongoDB', 'Tailwind CSS'],
      keyFeatures: ['Fully responsive on all devices', 'SEO-optimised from day one', 'Fast loading — under 3 seconds', 'Integrated with Google Analytics', 'Clean, maintainable codebase', 'Free 30-day post-launch support'],
      process: [
        { step: '01', title: 'Discovery Call', desc: 'We understand your goals, target audience, and requirements.' },
        { step: '02', title: 'Design Mockup', desc: 'We create a visual prototype for your review and approval.' },
        { step: '03', title: 'Development', desc: 'Our team builds the site with clean, scalable code.' },
        { step: '04', title: 'Launch & Support', desc: 'We deploy, test, and support you post-launch.' },
      ],
    },
    {
      title: 'Digital Marketing', slug: 'digital-marketing', icon: 'TrendingUp', order: 2,
      tag: 'High ROI', deliveryTime: 'Ongoing Monthly',
      shortDescription: 'Data-driven campaigns across SEO, social media, and paid ads to grow your brand online.',
      fullDescription: 'Our digital marketing services help businesses in Bhilwara and beyond reach their target audience. We run targeted Google Ads, Meta campaigns, and organic social media strategies that deliver measurable ROI and consistent lead generation.',
      techStack: ['Google Ads', 'Meta Ads', 'SEMrush', 'Google Analytics', 'Search Console', 'Mailchimp'],
      keyFeatures: ['Full SEO audit and on-page fixes', 'Google & Meta paid ad campaigns', 'Monthly analytics reports', 'Content marketing strategy', 'Keyword research & tracking', 'Conversion rate optimisation'],
      process: [
        { step: '01', title: 'Audit & Research', desc: 'Deep audit of your current digital presence and competitors.' },
        { step: '02', title: 'Strategy', desc: 'We build a tailored marketing plan with clear KPIs.' },
        { step: '03', title: 'Campaign Launch', desc: 'Ads and SEO go live with continuous monitoring.' },
        { step: '04', title: 'Report & Optimise', desc: 'Monthly reports and ongoing campaign improvements.' },
      ],
    },
    {
      title: 'IT Consulting', slug: 'it-consulting', icon: 'Lightbulb', order: 3,
      tag: 'Expert Advice', deliveryTime: '1–2 Weeks',
      shortDescription: 'Strategic IT guidance to align your technology infrastructure with your business goals.',
      fullDescription: 'We help businesses make smart technology decisions — from choosing the right software stack and cloud infrastructure to IT security audits and digital transformation roadmaps.',
      techStack: ['AWS', 'Azure', 'Jira', 'Confluence', 'Figma', 'Notion'],
      keyFeatures: ['Current system assessment', 'Technology roadmap design', 'Vendor & tool selection', 'Cost optimisation planning', 'Cloud architecture review', 'Digital transformation strategy'],
      process: [
        { step: '01', title: 'Assessment', desc: 'We evaluate your current workflows and pain points.' },
        { step: '02', title: 'Roadmap', desc: 'A detailed IT strategy aligned with your business goals.' },
        { step: '03', title: 'Implementation', desc: 'We guide your team through the transition plan.' },
        { step: '04', title: 'Review', desc: 'Ongoing advisory support for continuous improvement.' },
      ],
    },
    {
      title: 'Custom Software Development', slug: 'custom-software-development', icon: 'Code2', order: 4,
      tag: 'Built for You', deliveryTime: '4–12 Weeks',
      shortDescription: 'Bespoke software solutions built from scratch to automate and scale your operations.',
      fullDescription: 'Off-the-shelf software rarely fits every business. We build custom ERP systems, CRM platforms, inventory tools, and automation software that match exactly how your business works.',
      techStack: ['Node.js', 'React', 'PostgreSQL', 'Python', 'REST APIs', 'Docker'],
      keyFeatures: ['Custom ERP & CRM systems', 'Business process automation', 'Third-party API integrations', 'Admin dashboards & reporting', 'Scalable architecture', 'Ongoing maintenance & support'],
      process: [
        { step: '01', title: 'Requirements', desc: 'Detailed scoping of all features and workflows.' },
        { step: '02', title: 'Architecture', desc: 'System design, database schema, and tech stack selection.' },
        { step: '03', title: 'Development', desc: 'Agile sprints with regular demos and feedback.' },
        { step: '04', title: 'Deploy & Support', desc: 'Production deployment and ongoing maintenance.' },
      ],
    },
    {
      title: 'SEO & Branding', slug: 'seo-and-branding', icon: 'Star', order: 5,
      tag: 'Stand Out', deliveryTime: '2–3 Weeks',
      shortDescription: 'Build a strong online identity with expert SEO and cohesive brand design.',
      fullDescription: 'From keyword research and on-page SEO to logo design and brand guidelines, we help businesses establish a memorable, professional presence online.',
      techStack: ['Figma', 'Adobe Illustrator', 'SEMrush', 'Ahrefs', 'Google Search Console', 'Style Guides'],
      keyFeatures: ['Professional logo design', 'Full brand identity system', 'On-page & technical SEO', 'Keyword research & tracking', 'Brand guidelines document', 'Social media kit'],
      process: [
        { step: '01', title: 'Discovery', desc: 'Understanding your brand vision, values, and audience.' },
        { step: '02', title: 'Concepts', desc: 'Multiple design directions for your review.' },
        { step: '03', title: 'Refinement', desc: 'Finalise chosen concept with your feedback.' },
        { step: '04', title: 'Delivery', desc: 'Complete brand package in all required formats.' },
      ],
    },
    {
      title: 'Mobile App Development', slug: 'mobile-app-development', icon: 'Smartphone', order: 6,
      tag: 'iOS & Android', deliveryTime: '6–12 Weeks',
      shortDescription: 'Native and cross-platform mobile apps built with React Native and Flutter — App Store ready.',
      fullDescription: 'We design and build secure, fast, and feature-rich mobile applications for iOS and Android. Using React Native and Flutter, we deliver native-like performance with a single codebase.',
      techStack: ['React Native', 'Flutter', 'Firebase', 'REST APIs', 'App Store', 'Play Store'],
      keyFeatures: ['Cross-platform iOS & Android', 'Native-like performance', 'Push notifications & deep links', 'Offline mode support', 'App Store submission handled', 'Ongoing maintenance & updates'],
      process: [
        { step: '01', title: 'Wireframes', desc: 'Clickable prototypes for all key screens.' },
        { step: '02', title: 'UI Design', desc: 'Pixel-perfect screens matching your brand.' },
        { step: '03', title: 'Development', desc: 'React Native / Flutter codebase, API integrations.' },
        { step: '04', title: 'Publish', desc: 'Submit to App Store & Play Store with post-launch support.' },
      ],
    },
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: service,
      create: service,
    })
  }
  console.log(`✅ Seeded ${services.length} services`)

  // ── Testimonials ──────────────────────────────────────────────
  const testimonials = [
    {
      name: 'Aditya Sharma', role: 'Managing Director', company: 'Bhilwara Textiles Ltd.',
      text: 'Hindustan Projects completely modernized our operations with their custom ERP and corporate portal. Their local availability combined with world-class engineering standard was exactly what we needed. Highly recommended!',
      rating: 5, order: 1,
    },
    {
      name: 'Meera Johar', role: 'Founder & CEO', company: 'Jaipur Crafts E-Store',
      text: 'Dilshan and his team built our custom Shopify e-commerce platform and optimized our checkout flow. Within 3 months of launch, our conversion rates jumped by 42%. Their support team is incredibly prompt and friendly.',
      rating: 5, order: 2,
    },
    {
      name: 'Rajesh Singhal', role: 'Owner', company: 'Singhal Marbles & Granites',
      text: 'We tried multiple marketing agencies but got zero leads. Hindustan Projects designed a targeted SEO and Google Ads strategy for us. Today, we get 15+ high-quality commercial granite inquiries every week.',
      rating: 5, order: 3,
    },
  ]
  for (const t of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: t.name.replace(/\s+/g, '-').toLowerCase() },
      update: t,
      create: { id: t.name.replace(/\s+/g, '-').toLowerCase(), ...t },
    })
  }
  console.log(`✅ Seeded ${testimonials.length} testimonials`)

  // ── FAQs ──────────────────────────────────────────────────────
  const faqs = [
    { id: 'faq-1', question: 'How long does it take to build a website?', answer: 'For a standard corporate website, 3–4 weeks. Complex e-commerce or custom portals take 6–8 weeks. We provide clear phase-wise timelines at project start.', order: 1 },
    { id: 'faq-2', question: 'Do you provide support after launch?', answer: 'Yes. Every project includes 30 days of complimentary support. After that, we offer flexible annual maintenance plans covering security, updates, and SEO audits.', order: 2 },
    { id: 'faq-3', question: 'Will my website be mobile-friendly and SEO optimized?', answer: 'Absolutely. Every layout is fully responsive and we implement on-page SEO best practices — schema markup, semantic HTML, fast load times — from day one.', order: 3 },
    { id: 'faq-4', question: 'What are your payment terms?', answer: '30% deposit to start, 40% on design approval, 30% on final delivery. We also offer monthly retainer models for ongoing marketing and support.', order: 4 },
    { id: 'faq-5', question: 'Do you work with businesses outside Bhilwara?', answer: 'Yes! We serve clients across Rajasthan and pan-India. Most of our work is done remotely with video calls, shared project boards, and regular check-ins.', order: 5 },
  ]
  for (const f of faqs) {
    await prisma.faq.upsert({ where: { id: f.id }, update: f, create: f })
  }
  console.log(`✅ Seeded ${faqs.length} FAQs`)

  // ── Site Settings ─────────────────────────────────────────────
  const settings = [
    { key: 'phone', value: '+91 99999 99999' },
    { key: 'email', value: 'info@hindustanprojects.com' },
    { key: 'address', value: 'Bhilwara, Rajasthan 311001, India' },
    { key: 'whatsapp', value: '+91 99999 99999' },
    { key: 'linkedin', value: '#' },
    { key: 'instagram', value: '#' },
    { key: 'facebook', value: '#' },
    { key: 'tagline', value: 'Building Digital Solutions That Drive Business Growth' },
    { key: 'stat_projects', value: '50' },
    { key: 'stat_clients', value: '40' },
    { key: 'stat_experience', value: '5' },
    { key: 'stat_cities', value: '3' },
  ]
  for (const s of settings) {
    await prisma.siteSetting.upsert({ where: { key: s.key }, update: { value: s.value }, create: s })
  }
  console.log(`✅ Seeded ${settings.length} site settings`)

  // ── Milestones ────────────────────────────────────────────────
  const milestones = [
    { id: 'ms-1', year: '2019', title: 'Founded', desc: 'Hindustan Projects was born in Bhilwara with a mission to bring world-class IT to local businesses.', order: 1 },
    { id: 'ms-2', year: '2020', title: 'First 10 Clients', desc: 'Delivered web development and digital marketing for 10 businesses across Rajasthan.', order: 2 },
    { id: 'ms-3', year: '2022', title: 'Expanded Services', desc: 'Launched cloud, DevOps, and mobile app development verticals.', order: 3 },
    { id: 'ms-4', year: '2024', title: '40+ Happy Clients', desc: 'Crossed 40 happy clients mark, serving businesses pan-India.', order: 4 },
    { id: 'ms-5', year: '2025', title: 'Growing Strong', desc: 'Expanding our team and services to cover enterprise-level digital transformation.', order: 5 },
  ]
  for (const m of milestones) {
    await prisma.milestone.upsert({ where: { id: m.id }, update: m, create: m })
  }
  console.log(`✅ Seeded ${milestones.length} milestones`)

  // ── Partners ──────────────────────────────────────────────────
  const partners = [
    { id: 'p-1', name: 'Bhilwara Textiles', order: 1 },
    { id: 'p-2', name: 'Jaipur Crafts', order: 2 },
    { id: 'p-3', name: 'Singhal Marbles', order: 3 },
    { id: 'p-4', name: 'Rajasthan Polytech', order: 4 },
    { id: 'p-5', name: 'RetailHub', order: 5 },
  ]
  for (const p of partners) {
    await prisma.partner.upsert({ where: { id: p.id }, update: p, create: p })
  }
  console.log(`✅ Seeded ${partners.length} partners`)

  // ── Projects ──────────────────────────────────────────────────
  const projects = [
    {
      id: 'proj-1',
      title: 'Bhilwara Textiles E-Commerce Platform',
      slug: 'bhilwara-textiles-ecommerce',
      clientName: 'Bhilwara Textiles Ltd.',
      description: 'A full-stack e-commerce platform with inventory management, payment integration via Razorpay, and a custom admin dashboard. Increased online sales by 3x within 6 months of launch.',
      thumbnailUrl: '',
      images: [],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Razorpay', 'Tailwind CSS'],
      category: 'Web',
      isFeatured: true,
    },
    {
      id: 'proj-2',
      title: 'Jaipur Crafts Digital Marketing Campaign',
      slug: 'jaipur-crafts-marketing',
      clientName: 'Jaipur Crafts E-Store',
      description: 'Multi-channel digital marketing campaign spanning Google Ads, Meta Ads, and SEO. Achieved 3x ROI within 3 months. Conversion rates improved by 42% through checkout optimization.',
      thumbnailUrl: '',
      images: [],
      technologies: ['Google Ads', 'Meta Ads', 'SEO', 'Google Analytics'],
      category: 'Marketing',
      isFeatured: true,
    },
    {
      id: 'proj-3',
      title: 'Singhal Marbles Corporate Brand Identity',
      slug: 'singhal-marbles-branding',
      clientName: 'Singhal Marbles & Granites',
      description: 'Complete brand identity redesign including logo, brand guidelines, marketing collateral, and corporate website. Established a premium positioning in the B2B granite market.',
      thumbnailUrl: '',
      images: [],
      technologies: ['Figma', 'Adobe Illustrator', 'Brand Guidelines', 'WordPress'],
      category: 'Branding',
      isFeatured: true,
    },
    {
      id: 'proj-4',
      title: 'Textile ERP System',
      slug: 'textile-erp-system',
      clientName: 'Rajasthan Polytech Industries',
      description: 'Custom ERP solution for textile manufacturing — production tracking, inventory management, billing, and supplier management. Reduced operational overhead by 35%.',
      thumbnailUrl: '',
      images: [],
      technologies: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
      category: 'Software',
      isFeatured: false,
    },
    {
      id: 'proj-5',
      title: 'Restaurant Website & Local SEO',
      slug: 'restaurant-website-seo',
      clientName: 'Spice Garden Restaurant, Bhilwara',
      description: 'Responsive website with online menu, table booking system, and local SEO optimization. Restaurant now ranks #1 on Google for "restaurant in Bhilwara".',
      thumbnailUrl: '',
      images: [],
      technologies: ['React', 'Tailwind CSS', 'SEO', 'Google My Business'],
      category: 'Web',
      isFeatured: false,
    },
    {
      id: 'proj-6',
      title: 'Real Estate Social Media Growth',
      slug: 'real-estate-social-media',
      clientName: 'RetailHub Properties',
      description: 'Organic social media strategy growing followers from 500 to 12,000+ in 6 months. Content calendar, Reels production, and paid boost strategy for property listings.',
      thumbnailUrl: '',
      images: [],
      technologies: ['Instagram', 'Facebook', 'Canva', 'Meta Business Suite'],
      category: 'Marketing',
      isFeatured: false,
    },
    {
      id: 'proj-7',
      title: 'Logistics Mobile App',
      slug: 'logistics-mobile-app',
      clientName: 'FastMove Logistics, Rajasthan',
      description: 'Real-time GPS tracking and booking mobile app for a regional logistics provider. Features push notifications, driver management, and customer portal. Available on iOS & Android.',
      thumbnailUrl: '',
      images: [],
      technologies: ['React Native', 'Firebase', 'Google Maps API', 'Node.js'],
      category: 'App',
      isFeatured: false,
    },
  ]
  for (const p of projects) {
    await prisma.project.upsert({ where: { id: p.id }, update: p, create: p })
  }
  console.log(`✅ Seeded ${projects.length} projects`)

  // ── Team Members ──────────────────────────────────────────────
  const team = [
    {
      id: 'team-1',
      name: 'Mohammad Dilshan',
      role: 'Founder & CEO',
      bio: 'Visionary tech entrepreneur with 8+ years of experience in web development and digital strategy. Founded Hindustan Projects to bring world-class IT services to businesses in Bhilwara and Rajasthan.',
      linkedinUrl: '#',
      photoUrl: '',
      order: 1,
    },
    {
      id: 'team-2',
      name: 'Rohan Verma',
      role: 'Lead Software Architect',
      bio: '6+ years in full-stack engineering. Expert in React, Node.js, and cloud architectures. Has built and deployed 30+ production applications for clients across India.',
      linkedinUrl: '#',
      photoUrl: '',
      order: 2,
    },
    {
      id: 'team-3',
      name: 'Priya Mehta',
      role: 'Head of UI/UX Design',
      bio: 'Crafts intuitive, conversion-focused user interfaces and modern corporate brand guidelines. 5+ years designing digital products that users love.',
      linkedinUrl: '#',
      photoUrl: '',
      order: 3,
    },
    {
      id: 'team-4',
      name: 'Karan Singhal',
      role: 'Head of Digital Marketing',
      bio: 'Specialist in SEO, Google Ads, and Meta campaigns. Has managed ₹50L+ in ad spend with consistent 3-5x ROAS across industries.',
      linkedinUrl: '#',
      photoUrl: '',
      order: 4,
    },
  ]
  for (const m of team) {
    await prisma.teamMember.upsert({ where: { id: m.id }, update: m, create: m })
  }
  console.log(`✅ Seeded ${team.length} team members`)

  // ── Default Super Admin ────────────────────────────────────────
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@hindustanprojects.com'
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'ChangeMe@123'
  const passwordHash = await bcrypt.hash(adminPassword, 12)

  await prisma.admin.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash,
      role: 'SUPER_ADMIN',
    },
  })
  console.log(`✅ Seeded admin: ${adminEmail}`)
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.log('⚠️  Default admin password used. Set SEED_ADMIN_PASSWORD in .env before seeding in production!')
  }

  console.log('🎉 Seeding complete.')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
