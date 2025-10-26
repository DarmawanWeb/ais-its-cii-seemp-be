/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'ais-be',
      script: './dist/bin/www.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '4000M',
      node_args: '--max-old-space-size=3584',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3002
      },
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_restarts: 10,
      min_uptime: '10s',
      restart_delay: 4000,
      kill_timeout: 5000,
      listen_timeout: 10000
    }
  ]
};