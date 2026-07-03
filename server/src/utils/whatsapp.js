import twilio from 'twilio'
import { env } from '../config/env.js'

/**
 * Sends a WhatsApp notification to the admin.
 * Fails gracefully (logs warning, does not throw or crash) if Twilio is not configured or fails.
 */
export async function sendWhatsAppNotification(messageText) {
  const {
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_WHATSAPP_FROM,
    ADMIN_WHATSAPP_TO,
  } = env

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !ADMIN_WHATSAPP_TO) {
    console.warn('[WhatsApp] Twilio credentials or admin target number missing — skipping notification.')
    return false
  }

  try {
    const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
    const fromNumber = TWILIO_WHATSAPP_FROM.startsWith('whatsapp:') ? TWILIO_WHATSAPP_FROM : `whatsapp:${TWILIO_WHATSAPP_FROM}`
    const toNumber = ADMIN_WHATSAPP_TO.startsWith('whatsapp:') ? ADMIN_WHATSAPP_TO : `whatsapp:${ADMIN_WHATSAPP_TO}`

    const response = await client.messages.create({
      body: messageText,
      from: fromNumber,
      to: toNumber,
    })
    console.log(`[WhatsApp] Notification sent successfully. SID: ${response.sid}`)
    return true
  } catch (err) {
    console.error(`[WhatsApp] Failed to send notification: ${err.message}`)
    return false
  }
}
