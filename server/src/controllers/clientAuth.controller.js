/**
 * clientAuth.controller.js — Authentication for CLIENT portal
 */
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { env } from '../config/env.js'
import { setClientCookie, clearClientCookies } from '../utils/authCookie.js'

// POST /api/client/login
export const clientLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ status: 'error', message: 'Email and password are required.' })
    }

    const client = await prisma.client.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (!client) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' })
    }

    if (!client.isActive) {
      return res.status(403).json({
        status: 'error',
        message: 'Your account has been deactivated. Please contact support.',
      })
    }

    if (!client.passwordHash) {
      return res.status(400).json({
        status: 'error',
        message: 'Account not set up yet. Please use the link sent to your email to set a password.',
      })
    }

    const valid = await bcrypt.compare(password, client.passwordHash)
    if (!valid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials.' })
    }

    // Generate Client Access Token (expires in 24h)
    const token = jwt.sign(
      { id: client.id, email: client.email, role: 'CLIENT' },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    setClientCookie(res, token)

    res.json({
      status: 'ok',
      data: {
        id: client.id,
        name: client.name,
        email: client.email,
        role: 'CLIENT',
      },
    })
  } catch (err) {
    next(err)
  }
}

// GET /api/client/me
export const getClientProfile = async (req, res, next) => {
  try {
    if (!req.client) {
      return res.status(401).json({ status: 'error', message: 'Not authenticated.' })
    }
    res.json({
      status: 'ok',
      data: {
        id: req.client.id,
        name: req.client.name,
        email: req.client.email,
        role: 'CLIENT',
      },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/client/setup-password
export const setupClientPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body

    if (!token || !password) {
      return res.status(400).json({ status: 'error', message: 'Token and password are required.' })
    }

    if (password.length < 8) {
      return res.status(400).json({
        status: 'error',
        message: 'Password must be at least 8 characters long.',
      })
    }

    const client = await prisma.client.findUnique({
      where: { inviteToken: token },
    })

    if (!client || (client.inviteTokenExpires && new Date() > client.inviteTokenExpires)) {
      return res.status(400).json({
        status: 'error',
        message: 'Setup link is invalid or has expired.',
      })
    }

    const passwordHash = await bcrypt.hash(password, 12)

    const updatedClient = await prisma.client.update({
      where: { id: client.id },
      data: {
        passwordHash,
        inviteToken: null,
        inviteTokenExpires: null,
      },
    })

    // Log them in immediately
    const loginToken = jwt.sign(
      { id: updatedClient.id, email: updatedClient.email, role: 'CLIENT' },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    )

    setClientCookie(res, loginToken)

    res.json({
      status: 'ok',
      message: 'Password set successfully.',
      data: {
        id: updatedClient.id,
        name: updatedClient.name,
        email: updatedClient.email,
        role: 'CLIENT',
      },
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/client/logout
export const clientLogout = async (req, res, next) => {
  try {
    clearClientCookies(res)
    res.json({ status: 'ok', message: 'Logged out successfully.' })
  } catch (err) {
    next(err)
  }
}
