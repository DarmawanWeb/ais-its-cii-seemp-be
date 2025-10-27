/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'ais-be',
      script: './dist/bin/www.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '2000M',
      node_args: '--max-old-space-size=1792',
      env: {
        NODE_ENV: 'production',
        PORT: 3002,
        WORKER_ENABLED: 'false'  
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
    },
    {
      name: 'ais-worker',
      script: './dist/src/workers/illegal-transhipment-child-worker.js',  
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1000M',
      node_args: '--max-old-space-size=896',
      cron_restart: '*/5 * * * *',  
      autorestart: false,  
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};