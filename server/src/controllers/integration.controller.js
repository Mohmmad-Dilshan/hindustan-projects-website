/**
 * integration.controller.js
 *
 * Manages third-party integration credentials (Cloudinary, SMTP, reCAPTCHA)
 * stored securely in the SiteSetting table with a "sys_" prefix.
 *
 * Keys stored:
 *   sys_cloudinary_cloud_name, sys_cloudinary_api_key, sys_cloudinary_api_secret
 *   sys_smtp_host, sys_smtp_port, sys_smtp_user, sys_smtp_pass, sys_smtp_from
 *   sys_recaptcha_secret_key
 *
 * On GET  — sensitive values (api_secret, smtp_pass, recaptcha) are MASKED
 * On SAVE — values are stored in DB AND applied to process.env at runtime
 *           so Cloudinary / Nodemailer picks them up immediately (no restart needed)
 */

import prisma from '../config/db.js'

// Keys that must be masked in GET responses
const MASKED_KEYS = new Set([
  'sys_cloudinary_api_secret',
  'sys_smtp_pass',
  'sys_recaptcha_secret_key',
])

// Maps DB keys → process.env variable names
const ENV_MAP = {
  sys_cloudinary_cloud_name: 'CLOUDINARY_CLOUD_NAME',
  sys_cloudinary_api_key:    'CLOUDINARY_API_KEY',
  sys_cloudinary_api_secret: 'CLOUDINARY_API_SECRET',
  sys_smtp_host:             'EMAIL_HOST',
  sys_smtp_port:             'EMAIL_PORT',
  sys_smtp_user:             'EMAIL_USER',
  sys_smtp_pass:             'EMAIL_PASS',
  sys_smtp_from:             'EMAIL_FROM',
  sys_recaptcha_secret_key:  'RECAPTCHA_SECRET_KEY',
}

// All integration keys we manage
const ALL_KEYS = Object.keys(ENV_MAP)

/**
 * GET /api/admin/integrations
 * Returns current integration config — sensitive fields masked.
 */
export const getIntegrationConfig = async (_req, res, next) => {
  try {
    const rows = await prisma.siteSetting.findMany({
      where: { key: { in: ALL_KEYS } },
    })

    // Build response object, masking secrets
    const config = {}
    for (const key of ALL_KEYS) {
      const row = rows.find(r => r.key === key)
      const value = row?.value || ''

      if (MASKED_KEYS.has(key) && value) {
        // Show last 4 chars only: ••••••••xxxx
        config[key] = `${'•'.repeat(Math.max(0, value.length - 4))}${value.slice(-4)}`
      } else {
        config[key] = value
      }
    }

    // Also expose which services are currently active (have credentials)
    config._status = {
      cloudinary: !!(
        config.sys_cloudinary_cloud_name &&
        config.sys_cloudinary_api_key &&
        rows.find(r => r.key === 'sys_cloudinary_api_secret')?.value
      ),
      smtp: !!(
        config.sys_smtp_user &&
        rows.find(r => r.key === 'sys_smtp_pass')?.value
      ),
      recaptcha: !!rows.find(r => r.key === 'sys_recaptcha_secret_key')?.value,
    }

    res.json({ status: 'ok', data: config })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /api/admin/integrations
 * Save integration keys to DB and immediately apply to process.env.
 * Blank values are IGNORED (keeps existing secret).
 * Send "__CLEAR__" to explicitly delete a value.
 */
export const updateIntegrationConfig = async (req, res, next) => {
  try {
    const updates = req.body

    const opsToRun = []

    for (const [key, rawValue] of Object.entries(updates)) {
      // Only allow known integration keys
      if (!ALL_KEYS.includes(key)) continue

      const value = typeof rawValue === 'string' ? rawValue.trim() : ''

      if (value === '__CLEAR__') {
        // Explicit clear — delete from DB and unset env
        opsToRun.push(
          prisma.siteSetting.deleteMany({ where: { key } }).catch(() => {})
        )
        delete process.env[ENV_MAP[key]]
        continue
      }

      // Skip empty — don't overwrite existing secret with blank
      if (value === '') continue

      // For masked fields, skip if value looks like our masking pattern (user didn't change it)
      if (MASKED_KEYS.has(key) && /^•+/.test(value)) continue

      // Upsert to DB
      opsToRun.push(
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )

      // Apply to running process immediately
      process.env[ENV_MAP[key]] = value

      // Special: SMTP port needs to be numeric
      if (key === 'sys_smtp_port') {
        process.env.EMAIL_PORT = String(parseInt(value, 10) || 587)
      }
    }

    await Promise.all(opsToRun)

    // Reconfigure Cloudinary SDK if cloud keys were updated
    const cloudinaryKeys = ['sys_cloudinary_cloud_name', 'sys_cloudinary_api_key', 'sys_cloudinary_api_secret']
    const cloudinaryUpdated = Object.keys(updates).some(k => cloudinaryKeys.includes(k))
    if (cloudinaryUpdated) {
      try {
        // Dynamic import to avoid circular deps
        const { cloudinary } = await import('../utils/cloudinary.js')
        cloudinary.config({
          cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
          api_key:    process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
        })
      } catch (e) {
        console.warn('[integrations] Could not re-init Cloudinary:', e.message)
      }
    }

    res.json({ status: 'ok', message: 'Integration settings saved and applied.' })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/admin/integrations/test-smtp
 * Send a test email to the currently configured SMTP address.
 */
export const testSmtpConnection = async (req, res, next) => {
  try {
    const { sendEmail } = await import('../utils/mailer.js')

    const adminEmail = process.env.EMAIL_USER || process.env.EMAIL_FROM
    if (!adminEmail) {
      return res.status(400).json({
        status: 'error',
        message: 'SMTP not configured. Set EMAIL_USER first.',
      })
    }

    const targetEmail = adminEmail.replace(/.*<(.+)>/, '$1')

    await sendEmail({
      to: targetEmail,
      subject: 'Test Email — Hindustan Projects Admin',
      html: `<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #e5e7eb;border-radius:8px;max-width:500px">
        <h2 style="color:#1A3E8C;margin:0 0 12px">✅ SMTP Test Successful</h2>
        <p style="color:#374151">Your email configuration is working correctly.</p>
        <p style="color:#6B7280;font-size:13px;margin-top:20px;border-top:1px solid #f3f4f6;padding-top:12px">
          Sent from Hindustan Projects Admin Panel
        </p>
      </div>`,
      text: 'SMTP Test Successful — Your email configuration is working.',
    })

    res.json({ status: 'ok', message: `Test email sent to ${targetEmail}.` })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `SMTP test failed: ${err.message}`,
    })
  }
}

/**
 * POST /api/admin/integrations/test-cloudinary
 * Verify Cloudinary credentials by making a lightweight API call.
 */
export const testCloudinaryConnection = async (req, res, next) => {
  try {
    const { cloudinary } = await import('../utils/cloudinary.js')

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return res.status(400).json({
        status: 'error',
        message: 'Cloudinary credentials are not configured.',
      })
    }

    // Lightweight ping — fetches usage stats (doesn't upload anything)
    await cloudinary.api.ping()

    res.json({ status: 'ok', message: 'Cloudinary connection verified successfully.' })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: `Cloudinary test failed: ${err.message}`,
    })
  }
}
