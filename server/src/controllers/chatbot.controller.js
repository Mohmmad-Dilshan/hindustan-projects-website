import prisma from '../config/db.js'

/**
 * Normalizes text: lowercase, remove punctuation
 */
function normalize(text) {
  return (text || '').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '').trim()
}

/**
 * POST /api/chatbot/ask
 * 1. First tries to match against active Faq records in DB (admin-managed)
 * 2. Falls back to hardcoded keyword rules for pricing/hours/services/contact
 * 3. If still no match, returns a helpful fallback with contact link
 */
export const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Question string is required' })
    }

    const trimmed = question.trim()
    const clean = normalize(trimmed)

    let answer = null
    let isAnswered = false

    // ── STEP 1: Match against DB FAQ table (graceful fallback if DB is sleeping) ─
    try {
      const faqs = await prisma.faq.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
      })

      for (const faq of faqs) {
        const faqKeywords = normalize(faq.question)
          .split(/\s+/)
          .filter((w) => w.length > 3)

        const matchCount = faqKeywords.filter((kw) => clean.includes(kw)).length
        const matchRatio = faqKeywords.length > 0 ? matchCount / faqKeywords.length : 0

        if (matchRatio >= 0.4 || faqKeywords.some((kw) => kw.length > 4 && clean.includes(kw))) {
          answer = faq.answer
          isAnswered = true
          break
        }
      }
    } catch {
      // DB might be sleeping (Neon free tier) — skip to keyword rules
    }

    // ── STEP 2: Fallback keyword rules ────────────────────────────
    if (!isAnswered) {
      const pricing = ['price', 'pricing', 'cost', 'charges', 'fees', 'rate', 'budget', 'package', 'kitna', 'how much']
      const services = ['service', 'services', 'offer', 'develop', 'marketing', 'seo', 'branding', 'app', 'design', 'website', 'software', 'kya karte', 'kya kaam']
      const contact = ['contact', 'phone', 'email', 'call', 'whatsapp', 'reach', 'address', 'location', 'office', 'where', 'kahan', 'number']
      const hours = ['hours', 'time', 'open', 'schedule', 'timing', 'timings', 'days', 'weekend', 'kitne baje', 'kab']
      const portfolio = ['portfolio', 'project', 'work', 'sample', 'previous', 'client', 'example', 'case study']
      const careers = ['job', 'career', 'hiring', 'vacancy', 'internship', 'opening', 'apply', 'join', 'work with']

      if (pricing.some((k) => clean.includes(k))) {
        answer = '💰 **Pricing at Hindustan Projects** depends on the project scope.\n\n• Simple landing page: starting ₹15,000\n• Business website: ₹25,000–₹60,000\n• Custom web/mobile app, ERP, or SaaS: quoted individually\n\nContact us for a free detailed estimate — we\'ll tailor it to your exact requirements!'
        isAnswered = true
      } else if (services.some((k) => clean.includes(k))) {
        answer = '🛠️ **Our Services include:**\n\n• Web Development (React, Node.js, PHP, WordPress)\n• Mobile App Development (Flutter, React Native)\n• Custom Software & ERP Systems\n• UI/UX Design & Branding\n• Digital Marketing & SEO\n• E-Commerce Solutions\n\nVisit our Services page for full details!'
        isAnswered = true
      } else if (contact.some((k) => clean.includes(k))) {
        answer = '📞 **Reach us easily:**\n\n• 📧 Email: info@hindustanprojects.com\n• 📱 WhatsApp/Call: +91 99999 99999\n• 📍 Office: Bhilwara, Rajasthan, India\n\nOr submit the **Contact Form** on our website — we respond within 24 hours!'
        isAnswered = true
      } else if (hours.some((k) => clean.includes(k))) {
        answer = '⏰ **Business Hours:**\n\nMonday – Saturday: **10:00 AM to 7:00 PM IST**\n\nWe are closed on Sundays and national holidays. For urgent matters, drop us a WhatsApp!'
        isAnswered = true
      } else if (portfolio.some((k) => clean.includes(k))) {
        answer = '🎨 **Our Portfolio** showcases projects across web, mobile, ERP, and branding.\n\nVisit the **Portfolio** section on our website to see our latest client work with live demos!'
        isAnswered = true
      } else if (careers.some((k) => clean.includes(k))) {
        answer = '💼 **We\'re hiring!** Hindustan Projects regularly posts openings for developers, designers, and marketing roles.\n\nCheck the **Careers** page on our website for current openings and apply directly!'
        isAnswered = true
      }
    }

    // ── STEP 3: Save to DB for admin review (non-blocking) ───────
    try {
      await prisma.chatbotInquiry.create({
        data: { question: trimmed, answer, isAnswered },
      })
    } catch {
      // DB sleeping — skip saving, still return answer to user
    }

    // ── STEP 4: Return response ────────────────────────────────────
    const fallback =
      "🤔 I couldn't find a direct answer to that. Please use the **Contact Form** or WhatsApp us at +91 99999 99999 — our team will get back to you within 24 hours!"

    return res.json({
      status: 'ok',
      answered: isAnswered,
      answer: isAnswered ? answer : fallback,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Admin: List all chatbot inquiries (newest first)
 */
export const listInquiries = async (_req, res, next) => {
  try {
    const inquiries = await prisma.chatbotInquiry.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    })
    res.json({ status: 'ok', data: inquiries })
  } catch (err) {
    next(err)
  }
}

/**
 * Admin: Delete a single chatbot inquiry
 */
export const deleteInquiry = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.chatbotInquiry.delete({ where: { id } })
    res.json({ status: 'ok', message: 'Inquiry deleted.' })
  } catch (err) {
    next(err)
  }
}
