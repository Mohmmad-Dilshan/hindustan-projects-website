import './config/env.js' // load & validate env vars first
import { env } from './config/env.js'
import app from './app.js'
import prisma from './config/db.js'
import { logger } from './utils/logger.js'

const startServer = async () => {
  try {
    // Test DB connection
    await prisma.$connect()
    logger.info('Database connected successfully')

    app.listen(env.PORT, () => {
      logger.info(`Server running on http://localhost:${env.PORT} [${env.NODE_ENV}]`)
    })
  } catch (error) {
    logger.error('Failed to start server:', error.message)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received — shutting down gracefully')
  await prisma.$disconnect()
  process.exit(0)
})

startServer()
