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

  // ── Services ──────────────────────────────────────────────────
  const services = [
    {
      title: 'Web Development',
      slug: 'web-development',
      shortDescription:
        'Custom websites and web apps built with modern, scalable technology stacks.',
      fullDescription:
        'We design and develop responsive, high-performance websites and web applications tailored to your business needs. From landing pages to full-stack enterprise platforms, our team delivers clean code, fast load times, and seamless user experiences.',
      icon: 'Globe',
      order: 1,
    },
    {
      title: 'Digital Marketing',
      slug: 'digital-marketing',
      shortDescription:
        'Data-driven campaigns across SEO, social media, and paid ads to grow your brand online.',
      fullDescription:
        'Our digital marketing services help businesses in Bhilwara and beyond reach their target audience. We run targeted Google Ads, Meta campaigns, and organic social media strategies that deliver measurable ROI and consistent lead generation.',
      icon: 'TrendingUp',
      order: 2,
    },
    {
      title: 'IT Consulting',
      slug: 'it-consulting',
      shortDescription:
        'Strategic IT guidance to align your technology infrastructure with your business goals.',
      fullDescription:
        'We help businesses make smart technology decisions — from choosing the right software stack and cloud infrastructure to IT security audits and digital transformation roadmaps. Our consultants bring real-world experience to solve your technology challenges.',
      icon: 'Lightbulb',
      order: 3,
    },
    {
      title: 'Custom Software Development',
      slug: 'custom-software-development',
      shortDescription:
        'Bespoke software solutions built from scratch to automate and scale your operations.',
      fullDescription:
        'Off-the-shelf software rarely fits every business perfectly. We build custom ERP systems, CRM platforms, inventory management tools, and automation software that match exactly how your business works — saving time and reducing operational costs.',
      icon: 'Code2',
      order: 4,
    },
    {
      title: 'SEO & Branding',
      slug: 'seo-and-branding',
      shortDescription:
        'Build a strong online identity with expert SEO and cohesive brand design.',
      fullDescription:
        'From keyword research and on-page SEO to logo design and brand guidelines, we help businesses establish a memorable, professional presence online. Our branding work ensures consistency across your website, social profiles, and marketing materials.',
      icon: 'Star',
      order: 5,
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
