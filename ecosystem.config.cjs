module.exports = {
  apps: [{
    name: 'Edu Resolve backend',
    script: 'server.js',
    instances: '4',
    autorestart: true,
    max_memory_restart: '1G',
    watch: true,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }

  }]
}
