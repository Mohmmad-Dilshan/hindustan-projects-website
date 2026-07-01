/**
 * GET /api/health
 * Basic health check endpoint
 */
export const healthCheck = (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'hindustan-projects-api',
  })
}
