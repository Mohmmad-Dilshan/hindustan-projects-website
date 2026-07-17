/**
 * attachments.controller.js — Handles creating and deleting attachments for Leads, Tasks, and Projects
 */
import prisma from '../config/db.js'
import { uploadToCloudinary, cloudinary } from '../utils/cloudinary.js'
import { logActivity } from '../utils/activity.js'

// POST /api/upload/attachment
export const createAttachment = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: 'No file provided.' })
    }

    const { leadId, taskId, clientProjectId } = req.body

    if (!leadId && !taskId && !clientProjectId) {
      return res.status(400).json({
        status: 'error',
        message: 'Attachment must be linked to a leadId, taskId, or clientProjectId.',
      })
    }

    // Determine resource type for Cloudinary
    const isImage = req.file.mimetype.startsWith('image/')
    const resourceType = isImage ? 'image' : 'raw'

    // Upload to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'hindustan-projects-attachments', resourceType)

    // Save attachment in database
    const attachment = await prisma.attachment.create({
      data: {
        fileName: req.file.originalname,
        fileUrl: result.secure_url,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        publicId: result.public_id,
        leadId: leadId || null,
        taskId: taskId || null,
        clientProjectId: clientProjectId || null,
      },
    })

    // Log activity
    let entityType = 'Attachment'
    let details = `Attached file '${attachment.fileName}'`
    if (leadId) details += ` to Lead ID: ${leadId}`
    if (taskId) details += ` to Task ID: ${taskId}`
    if (clientProjectId) details += ` to Project ID: ${clientProjectId}`

    await logActivity(req, 'CREATE', entityType, details)

    res.status(201).json({ status: 'ok', data: attachment })
  } catch (err) {
    next(err)
  }
}

// DELETE /api/upload/attachment/:id
export const deleteAttachment = async (req, res, next) => {
  try {
    const { id } = req.params

    const attachment = await prisma.attachment.findUnique({
      where: { id },
    })

    if (!attachment) {
      return res.status(404).json({ status: 'error', message: 'Attachment not found.' })
    }

    // Delete from Cloudinary if publicId exists
    if (attachment.publicId) {
      const isImage = attachment.fileType.startsWith('image/')
      const resourceType = isImage ? 'image' : 'raw'
      
      await cloudinary.uploader.destroy(attachment.publicId, {
        resource_type: resourceType,
      }).catch((err) => {
        console.error('[Cloudinary] Failed to delete file:', err.message)
      })
    }

    // Delete from database
    await prisma.attachment.delete({
      where: { id },
    })

    await logActivity(
      req,
      'DELETE',
      'Attachment',
      `Deleted attachment '${attachment.fileName}'`
    )

    res.json({ status: 'ok', message: 'Attachment deleted successfully.' })
  } catch (err) {
    next(err)
  }
}
