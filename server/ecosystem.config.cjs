module.exports = {
  apps: [
    {
      name: 'hindustan-projects-backend',
      script: './src/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
}
