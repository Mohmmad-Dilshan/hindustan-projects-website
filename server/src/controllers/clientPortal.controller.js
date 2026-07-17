/**
 * clientPortal.controller.js — Client-scoped queries for their projects
 */
import prisma from '../config/db.js'

// GET /api/client/projects
export const getClientProjects = async (req, res, next) => {
  try {
    const clientId = req.client.id

    const projects = await prisma.clientProject.findMany({
      where: { clientId },
      include: {
        _count: {
          select: { tasks: true },
        },
        tasks: {
          select: { status: true },
        },
      },
      orderBy: { deadline: 'asc' },
    })

    // Add completion stats
    const formatted = projects.map((p) => {
      const totalTasks = p._count.tasks
      const completedTasks = p.tasks.filter((t) => t.status === 'DONE').length
      
      // Remove raw tasks list from dashboard overview for speed
      const { tasks, _count, ...rest } = p

      return {
        ...rest,
        taskStats: {
          total: totalTasks,
          completed: completedTasks,
        },
      };
    })

    res.json({ status: 'ok', data: formatted })
  } catch (err) {
    next(err)
  }
}

// GET /api/client/projects/:id
export const getClientProjectById = async (req, res, next) => {
  try {
    const { id } = req.params
    const clientId = req.client.id

    const project = await prisma.clientProject.findFirst({
      where: { id, clientId },
      include: {
        tasks: {
          orderBy: { createdAt: 'desc' },
        },
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!project) {
      return res.status(404).json({ status: 'error', message: 'Project not found.' })
    }

    res.json({ status: 'ok', data: project })
  } catch (err) {
    next(err)
  }
}
