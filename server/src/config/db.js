import { PrismaClient } from '@prisma/client'

const realPrisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['error'],
})

// ── High-Fidelity Mock Datasets ──────────────────────────────
const mockServices = [
  { id: '1', title: 'Web Development', slug: 'web-development', icon: 'Code2', order: 1, isActive: true, shortDescription: 'Custom, responsive websites built with modern technologies like React, Node.js, and WordPress — optimised for speed, SEO, and conversions.', fullDescription: 'We design and build bespoke web solutions that scale. Whether you need a simple corporate landing page, a content management system, or a bespoke web application, our developers write clean, robust code that delivers high performance.', createdAt: new Date(), updatedAt: new Date() },
  { id: '2', title: 'Digital Marketing & SEO', slug: 'digital-marketing-seo', icon: 'Megaphone', order: 2, isActive: true, shortDescription: 'Result-driven digital marketing campaigns spanning SEO, Google Ads, Meta Ads, and content marketing to drive high-intent leads.', fullDescription: 'Get your business in front of the right audience. Our digital marketing strategies are built on data and focused on ROI. We run complete search engine optimization (SEO) campaigns to rank your business organically.', createdAt: new Date(), updatedAt: new Date() },
  { id: '3', title: 'IT Consulting & Strategy', slug: 'it-consulting-strategy', icon: 'Lightbulb', order: 3, isActive: true, shortDescription: 'Strategic IT advisory to align your technology roadmap with business growth. We help you choose the right systems and architecture.', fullDescription: 'Make informed technology decisions. Our expert consultants analyze your current business workflows, systems, and requirements to design a scalable IT strategy.', createdAt: new Date(), updatedAt: new Date() },
  { id: '4', title: 'E-Commerce Solutions', slug: 'ecommerce-solutions', icon: 'Monitor', order: 4, isActive: true, shortDescription: 'End-to-end e-commerce store setup, checkout optimisation, inventory management systems, and secure payment gateway integrations.', fullDescription: 'Turn website visitors into paying customers. We build feature-rich e-commerce stores with smooth checkout experiences, secure payment gateways, and automated inventory sync.', createdAt: new Date(), updatedAt: new Date() },
  { id: '5', title: 'Cloud Solutions & DevOps', slug: 'cloud-solutions-devops', icon: 'Settings', order: 5, isActive: true, shortDescription: 'Secure cloud hosting setup, AWS/Google Cloud management, server scaling, and continuous deployment workflows for zero downtime.', fullDescription: 'Build a stable, secure, and scalable cloud infrastructure. We manage cloud deployments on Amazon Web Services (AWS), Google Cloud Platform (GCP), and DigitalOcean.', createdAt: new Date(), updatedAt: new Date() },
  { id: '6', title: 'Branding & UI/UX Design', slug: 'branding-ui-ux-design', icon: 'Layers', order: 6, isActive: true, shortDescription: 'Premium user interface and user experience designs coupled with complete corporate brand identity systems, logos, and guidelines.', fullDescription: 'Create a lasting impression. Our design team focuses on crafting modern, intuitive user interfaces (UI) and frictionless user experiences (UX) that make your product a joy to use.', createdAt: new Date(), updatedAt: new Date() },
  { id: '7', title: 'Mobile App Development', slug: 'mobile-app-development', icon: 'Smartphone', order: 7, isActive: true, shortDescription: 'Native and cross-platform mobile apps for iOS and Android built with React Native and Flutter. Secure, high-performing, and published on App Stores.', fullDescription: 'Expand your reach to mobile users worldwide. We design and build secure, fast, and feature-rich mobile applications for iOS and Android platforms.', createdAt: new Date(), updatedAt: new Date() }
]

const mockProjects = [
  { id: 'p-1', title: 'E-Commerce Platform', slug: 'e-commerce-platform', clientName: 'Retail Client, Bhilwara', category: 'Web', isFeatured: true, technologies: ['React', 'Node.js', 'PostgreSQL'], description: 'A full-stack e-commerce platform with inventory management, payment integration, and admin dashboard.', thumbnailUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&q=80&auto=format&fit=crop', images: [], createdAt: new Date(), updatedAt: new Date() },
  { id: 'p-2', title: 'Digital Marketing Campaign', slug: 'digital-marketing-campaign', clientName: 'Fashion Brand, Jaipur', category: 'Marketing', isFeatured: true, technologies: ['Google Ads', 'Meta Ads', 'SEO'], description: 'Multi-channel digital marketing campaign achieving 3x ROI within 3 months for a fashion brand.', thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80&auto=format&fit=crop', images: [], createdAt: new Date(), updatedAt: new Date() },
  { id: 'p-3', title: 'Corporate Brand Identity', slug: 'corporate-brand-identity', clientName: 'Manufacturing Co., Bhilwara', category: 'Branding', isFeatured: true, technologies: ['Figma', 'Illustrator'], description: 'Complete brand identity design including logo, brand guidelines, and marketing collateral.', thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80&auto=format&fit=crop', images: [], createdAt: new Date(), updatedAt: new Date() },
  { id: 'p-4', title: 'ERP System', slug: 'erp-system', clientName: 'Textile Company, Bhilwara', category: 'Software', isFeatured: false, technologies: ['Node.js', 'React', 'MySQL'], description: 'Custom ERP solution for textile manufacturing - production tracking, inventory, billing.', thumbnailUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80&auto=format&fit=crop', images: [], createdAt: new Date(), updatedAt: new Date() }
]

const mockTeam = [
  { id: 't-1', name: 'Mohmmad Dilshan', role: 'Founder & Lead Architect', bio: 'Technical pioneer with 5+ years of experience building products.', linkedinUrl: 'https://linkedin.com', order: 1 },
  { id: 't-2', name: 'Priya Sharma', role: 'Head of Marketing', bio: 'Expert in PPC, SEO, and strategic brand consulting.', linkedinUrl: 'https://linkedin.com', order: 2 }
]

// ── Mock Database Client Wrapper ─────────────────────────────
const mockPrisma = {
  $connect: () => Promise.resolve(),
  $disconnect: () => Promise.resolve(),
  service: {
    findMany: async (args) => mockServices,
    findUnique: async (args) => mockServices.find(s => s.slug === args.where.slug) || null
  },
  project: {
    findMany: async (args) => {
      let list = mockProjects
      if (args?.where?.category) list = list.filter(p => p.category === args.where.category)
      if (args?.where?.isFeatured) list = list.filter(p => p.isFeatured === true)
      return list
    },
    findUnique: async (args) => mockProjects.find(p => p.slug === args.where.slug) || null
  },
  teamMember: {
    findMany: async (args) => mockTeam
  },
  contactLead: {
    create: async (args) => ({ id: "mock-lead", ...args.data, createdAt: new Date() })
  },
  admin: {
    findUnique: async (args) => null
  }
}

// ── Smart Connection Resolver ───────────────────────────────
let activeClient = realPrisma

try {
  console.log("Checking local database connection (localhost:5432)...")
  await realPrisma.$connect()
  console.log("Database connected successfully.")
} catch (e) {
  console.warn("⚠️ Database is offline. Starting server in MOCK client mode.")
  activeClient = mockPrisma
}

export default activeClient
