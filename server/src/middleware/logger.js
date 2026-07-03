/**
 * logger.js — Production-grade lightweight request logger middleware
 * Logs to standard output (console.log) for seamless capture by cloud platforms (Render, Heroku).
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now()
  const ip = req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress

  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(
      `[REQUEST] ${new Date().toISOString()} | IP: ${ip} | Method: ${req.method} | Path: ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`
    )
  })

  next()
}
