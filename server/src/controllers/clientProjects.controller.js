/**
 * clientProjects.controller.js — Admin CRUD for Client Projects
 */
import prisma from '../config/db.js'
import { logActivity } from '../utils/activity.js'
import sendMail from '../utils/mailer.js'

export const listClientProjects = async (req, res, next) => {
  try {
    const projects = await prisma.clientProject.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      include: {
        tasks: true,
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })
    res.json({ status: 'ok', data: projects })
  } catch (err) {
    next(err)
  }
}

export const createClientProject = async (req, res, next) => {
  try {
    const {
      clientName,
      projectTitle,
      description,
      startDate,
      deadline,
      assignedTo,
      budget,
      tags,
      notes,
      status,
      priority,
      progress,
      clientId,
    } = req.body
    if (!clientName || !projectTitle || !startDate || !deadline) {
      return res.status(400).json({
        status: 'error',
        message: 'Client name, project title, start date, and deadline are required.',
      })
    }
    const project = await prisma.clientProject.create({
      data: {
        clientName,
        projectTitle,
        description,
        startDate: new Date(startDate),
        deadline: new Date(deadline),
        assignedTo,
        budget,
        tags: tags ?? [],
        notes,
        status: status ?? 'PLANNING',
        priority: priority ?? 'MEDIUM',
        progress: progress ? parseInt(progress) : 0,
        clientId: clientId || null,
      },
      include: {
        tasks: true,
        attachments: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    await logActivity(
      req,
      'CREATE',
      'ClientProject',
      `Created project '${project.projectTitle}' for client '${project.clientName}'`
    )

    // Dispatch portal update notification email asynchronously if client is linked
    if (project.client && project.client.email) {
      sendMail({
        to: project.client.email,
        subject: `🚀 New Project Initialized: ${project.projectTitle}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #1e3a8a; margin-top: 0;">Project Setup: ${project.projectTitle}</h2>
            <p>Dear <strong>${project.client.name}</strong>,</p>
            <p>Your new project portal workspace has been successfully created by Hindustan Projects:</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #cbd5e1;">
              <p style="margin: 6px 0;"><strong>Status:</strong> ${project.status}</p>
              <p style="margin: 6px 0;"><strong>Start Date:</strong> ${new Date(project.startDate).toLocaleDateString('en-IN')}</p>
              <p style="margin: 6px 0;"><strong>Estimated Deadline:</strong> ${new Date(project.deadline).toLocaleDateString('en-IN')}</p>
              <p style="margin: 6px 0;"><strong>Assigned Lead:</strong> ${project.assignedTo || 'Senior Tech Lead'}</p>
            </div>
            <p>Log into your Client Portal to track real-time progress, review milestone invoices, and access your project File Vault:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://itservices.hindustanprojects.in/client/projects/${project.id}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">View Project in Client Portal</a>
            </div>
            <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">Hindustan Projects IT Services — Corporate Office: Bhilwara, Rajasthan</p>
          </div>
        `,
      }).catch((err) => console.error('[ClientProject/mailer] Email notification failed:', err.message))
    }

    res.status(201).json({ status: 'ok', data: project })
  } catch (err) {
    next(err)
  }
}

export const updateClientProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const updateData = { ...req.body }

    // Sanitize updateData to delete relational objects & metadata that break Prisma scalar update
    delete updateData.id
    delete updateData.tasks
    delete updateData.attachments
    delete updateData.client
    delete updateData.createdAt
    delete updateData.updatedAt
    delete updateData.deletedAt

    if (updateData.startDate) updateData.startDate = new Date(updateData.startDate)
    if (updateData.deadline) updateData.deadline = new Date(updateData.deadline)
    if (updateData.progress !== undefined) updateData.progress = parseInt(updateData.progress)
    if (updateData.clientId === '') {
      updateData.clientId = null
    }

    const project = await prisma.clientProject.update({
      where: { id },
      data: updateData,
      include: {
        tasks: true,
        attachments: {
          orderBy: { createdAt: 'desc' },
        },
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    await logActivity(
      req,
      'UPDATE',
      'ClientProject',
      `Updated project '${project.projectTitle}' (Progress: ${project.progress}%, Status: ${project.status})`
    )

    // Dispatch portal update notification email asynchronously if client is linked
    if (project.client && project.client.email) {
      sendMail({
        to: project.client.email,
        subject: `🚀 Project Progress Update: ${project.projectTitle} (${project.progress}% Complete)`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 16px;">
            <h2 style="color: #1e3a8a; margin-top: 0;">Project Update: ${project.projectTitle}</h2>
            <p>Dear <strong>${project.client.name}</strong>,</p>
            <p>Your project progress and milestone status have been updated on the Hindustan Projects portal:</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 12px; margin: 16px 0; border: 1px solid #cbd5e1;">
              <p style="margin: 6px 0;"><strong>Status:</strong> ${project.status}</p>
              <p style="margin: 6px 0;"><strong>Completion Progress:</strong> ${project.progress}%</p>
              <p style="margin: 6px 0;"><strong>Project Lead:</strong> ${project.assignedTo || 'Assigned Lead'}</p>
              <p style="margin: 6px 0;"><strong>Target Deadline:</strong> ${new Date(project.deadline).toLocaleDateString('en-IN')}</p>
            </div>
            <p>Check the latest deliverables, upload asset files, or review GST invoices inside your Client Portal:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="https://itservices.hindustanprojects.in/client/projects/${project.id}" style="background-color: #2563eb; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; display: inline-block;">Open Client Portal Project</a>
            </div>
            <p style="font-size: 11px; color: #64748b; margin-top: 24px; border-top: 1px solid #e2e8f0; padding-top: 12px;">Hindustan Projects IT Services — Corporate Office: Bhilwara, Rajasthan</p>
          </div>
        `,
      }).catch((err) => console.error('[ClientProject/mailer] Email notification failed:', err.message))
    }

    res.json({ status: 'ok', data: project })
  } catch (err) {
    next(err)
  }
}

export const deleteClientProject = async (req, res, next) => {
  try {
    const { id } = req.params
    const project = await prisma.clientProject.findUnique({ where: { id } })
    if (project) {
      await prisma.clientProject.update({
        where: { id },
        data: { deletedAt: new Date() },
      })
      await logActivity(
        req,
        'DELETE',
        'ClientProject',
        `Soft deleted project '${project.projectTitle}' (Client: ${project.clientName})`
      )
    }
    res.json({ status: 'ok', message: 'Client project soft deleted.' })
  } catch (err) {
    next(err)
  }
}
