import prisma from '../config/db.js'

/**
 * GET /api/services
 * Returns all active services ordered by the `order` field.
 */
export const getAllServices = async (_req, res, next) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      select: {
        id: true,
        title: true,
        slug: true,
        shortDescription: true,
        icon: true,
        order: true,
      },
    })
    res.json({ status: 'ok', data: services })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/services/:slug
 * Returns a single service by slug (full detail).
 */
export const getServiceBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params
    const service = await prisma.service.findUnique({
      where: { slug },
    })

    if (!service || !service.isActive) {
      return res.status(404).json({ status: 'error', message: 'Service not found.' })
    }

    res.json({ status: 'ok', data: service })
  } catch (err) {
    next(err)
  }
}
