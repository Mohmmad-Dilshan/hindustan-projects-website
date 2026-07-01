/**
 * useContact.js — TanStack Query mutation for contact form submission.
 * Sends POST /api/contact with reCAPTCHA token + honeypot field.
 */

import { useMutation } from '@tanstack/react-query'
import { api, ApiError } from '../utils/api'

/**
 * Submits the contact form.
 * @param {object} formData — { name, email, phone, message, serviceInterested, recaptchaToken, _hp }
 */
async function submitContactForm(formData) {
  return api.post('/contact', formData)
}

export function useContact() {
  return useMutation({
    mutationFn: submitContactForm,
    // No onSuccess/onError here — handled in component via mutation.isSuccess etc.
  })
}
