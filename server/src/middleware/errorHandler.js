/**
 * Global error handling middleware
 */
export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || err.status || 500
  let message = err.message || 'Internal Server Error'

  // Catch database connection pool timeout / exhaustion errors
  if (
    err.code === 'P2024' ||
    message.includes('connection pool') ||
    message.includes('too many connections') ||
    message.includes('Timed out waiting for a free connection')
  ) {
    statusCode = 503
    message = 'The server is temporarily busy and unable to connect to the database. Please try again in a few moments.'
    res.setHeader('Retry-After', '5')
  }

  console.error(`[Error] ${statusCode} - ${message}`)
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // Log backend server crashes (5xx errors) to custom ErrorLog table
  if (statusCode >= 500) {
    import('../controllers/monitoring.controller.js')
      .then((m) => {
        m.recordBackendError(message, _req?.originalUrl, _req?.headers?.['user-agent'])
      })
      .catch((e) => console.error('[errorHandler] recordBackendError import failed:', e.message))
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
