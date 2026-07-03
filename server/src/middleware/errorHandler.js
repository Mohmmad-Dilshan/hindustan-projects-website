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

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}
