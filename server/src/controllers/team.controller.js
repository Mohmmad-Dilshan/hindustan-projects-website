import prisma from '../config/db.js'

/**
 * GET /api/team
 * Returns all team members ordered by the `order` field.
 */
export const getAllTeamMembers = async (_req, res, next) => {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
      select: {
        id: true,
        name: true,
        role: true,
        photoUrl: true,
        bio: true,
        linkedinUrl: true,
        order: true,
      },
    })
    res.json({ status: 'ok', data: members })
  } catch (err) {
    next(err)
  }
}
