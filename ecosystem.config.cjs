module.exports = {
  apps: [
    {
      name: 'oasis-bi-pro',
      script: 'npm',
      args: 'run dev',
      cwd: '/home/user/webapp/oasis-bi-pro',
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
