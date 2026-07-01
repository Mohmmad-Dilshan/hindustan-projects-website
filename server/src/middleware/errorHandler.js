/**
 * Global error handling middleware
 */
export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || err.status || 500
  const message = err.message || 'Internal Server Error'

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
