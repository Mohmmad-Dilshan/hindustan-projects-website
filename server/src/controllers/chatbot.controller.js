import prisma from '../config/db.js'

/**
 * Normalizes a string by converting to lowercase and stripping punctuation.
 */
function normalizeText(text) {
  return (text || '').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, '').trim()
}

export const askQuestion = async (req, res, next) => {
  try {
    const { question } = req.body

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Question string is required' })
    }

    const cleanQuestion = normalizeText(question)

    // Predefined QA database
    const pricingKeywords = ['price', 'pricing', 'cost', 'charge', 'fees', 'rate', 'budget', 'charges', 'packages']
    const servicesKeywords = ['service', 'services', 'offer', 'do you do', 'develop', 'marketing', 'seo', 'branding', 'app', 'design', 'website', 'software']
    const contactKeywords = ['contact', 'phone', 'email', 'call', 'talk', 'support', 'reach', 'address', 'location', 'office', 'where', 'map']
    const hoursKeywords = ['hours', 'time', 'open', 'schedule', 'timing', 'timings', 'days', 'weekend']

    let answer = null
    let isAnswered = false

    if (pricingKeywords.some((k) => cleanQuestion.includes(k))) {
      answer = 'Hindustan Projects offers competitive pricing depending on project scope. A standard professional landing page begins around ₹15,000, while complex ERP/SaaS systems and custom e-commerce platforms are scoped individually. Get in touch with us for a detailed project estimation!'
      isAnswered = true
    } else if (servicesKeywords.some((k) => cleanQuestion.includes(k))) {
      answer = 'We provide end-to-end IT services: Web Development (React, Node.js, PHP, WordPress), Custom Mobile App Development (iOS & Android via Flutter/React Native), Custom Software/ERP Systems, Branding & UI/UX design, and Digital Marketing/SEO campaigns.'
      isAnswered = true
    } else if (contactKeywords.some((k) => cleanQuestion.includes(k))) {
      answer = 'You can reach us via email at info@hindustanprojects.com, call/WhatsApp us at +91 99999 99999, or visit our headquarters in Bhilwara, Rajasthan (India). You can also submit the Contact form on our site!'
      isAnswered = true
    } else if (hoursKeywords.some((k) => cleanQuestion.includes(k))) {
      answer = 'Our business hours are Monday through Saturday, from 10:00 AM to 7:00 PM IST. We are closed on Sundays and national holidays.'
      isAnswered = true
    }

    // Save inquiry to database for admin review
    const inquiry = await prisma.chatbotInquiry.create({
      data: {
        question: question.trim(),
        answer,
        isAnswered,
      },
    })

    if (isAnswered) {
      return res.json({
        status: 'ok',
        answered: true,
        answer,
        data: inquiry,
      })
    }

    // Fallback response for unhandled questions
    const fallbackAnswer = "I couldn't find a direct answer to that. For detailed inquiries, please use our Contact form or reach out directly at info@hindustanprojects.com."
    return res.json({
      status: 'ok',
      answered: false,
      answer: fallbackAnswer,
      data: inquiry,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Admin: List chatbot inquiries
 */
export const listInquiries = async (_req, res, next) => {
  try {
    const inquiries = await prisma.chatbotInquiry.findMany({
      orderBy: { createdAt: 'desc' },
    })
    res.json({ status: 'ok', data: inquiries })
  } catch (err) {
    next(err)
  }
}

/**
 * Admin: Delete chatbot inquiry
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
