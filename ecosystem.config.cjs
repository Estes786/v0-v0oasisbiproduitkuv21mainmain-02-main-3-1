module.exports = {
  apps: [
    {
      name: 'oasis-bi-pro-main',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/oasis-bi-pro-main',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_memory_restart: '1G'
    }
  ]
}
