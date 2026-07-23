import prisma from '../config/db.js'

export const listSocialDrafts = async (_req, res, next) => {
  try {
    const drafts = await prisma.socialPostDraft.findMany({
      include: {
        project: {
          select: { id: true, title: true, category: true, clientName: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json({ status: 'ok', data: drafts })
  } catch (err) {
    next(err)
  }
}

export const updateSocialDraftStatus = async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, platform, text, campaignName, scheduledFor, mediaUrls } = req.body

    const updateData = {}
    if (status && ['DRAFT', 'SCHEDULED', 'POSTED'].includes(status)) {
      updateData.status = status
    }
    if (platform && ['LINKEDIN', 'TWITTER', 'INSTAGRAM', 'FACEBOOK', 'ALL'].includes(platform)) {
      updateData.platform = platform
    }
    if (text !== undefined) updateData.text = text
    if (campaignName !== undefined) updateData.campaignName = campaignName
    if (scheduledFor !== undefined) updateData.scheduledFor = scheduledFor ? new Date(scheduledFor) : null
    if (Array.isArray(mediaUrls)) updateData.mediaUrls = mediaUrls

    const draft = await prisma.socialPostDraft.update({
      where: { id },
      data: updateData,
      include: {
        project: {
          select: { id: true, title: true, category: true, clientName: true },
        },
      },
    })
    res.json({ status: 'ok', data: draft })
  } catch (err) {
    next(err)
  }
}

export const deleteSocialDraft = async (req, res, next) => {
  try {
    const { id } = req.params
    await prisma.socialPostDraft.delete({ where: { id } })
    res.json({ status: 'ok', message: 'Social post draft deleted.' })
  } catch (err) {
    next(err)
  }
}

export const createSocialDraft = async (req, res, next) => {
  try {
    const { projectId, text, status, platform, campaignName, scheduledFor, mediaUrls } = req.body
    if (!text) {
      return res.status(400).json({ status: 'error', message: 'Social post text is required.' })
    }

    const adminId = req.user?.id || null

    const draft = await prisma.socialPostDraft.create({
      data: {
        projectId: projectId || null,
        platform: platform && ['LINKEDIN', 'TWITTER', 'INSTAGRAM', 'FACEBOOK', 'ALL'].includes(platform) ? platform : 'ALL',
        text: text.trim(),
        campaignName: campaignName || null,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : null,
        mediaUrls: Array.isArray(mediaUrls) ? mediaUrls : [],
        status: status && ['DRAFT', 'SCHEDULED', 'POSTED'].includes(status) ? status : 'DRAFT',
        authorAdminId: adminId,
      },
      include: {
        project: {
          select: { id: true, title: true, category: true, clientName: true },
        },
      },
    })
    res.json({ status: 'ok', data: draft })
  } catch (err) {
    next(err)
  }
}
