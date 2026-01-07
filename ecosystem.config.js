/* eslint-disable */
module.exports = {
  apps: [
    {
      name: 'ais-api',
      script: './dist/bin/www.js',
      instances: 1,
      exec_mode: 'fork',
      max_memory_restart: '1500M',
      node_args: '--max-old-space-size=1280',
      env: {
        NODE_ENV: 'production',
        PORT: 3002
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 3002
      },
      error_file: './logs/api-error.log',
      out_file: './logs/api-out.log',
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
    // {
    //   name: 'ais-worker',
    //   script: './dist/bin/worker.js',
    //   instances: 1,
    //   exec_mode: 'fork',
    //   max_memory_restart: '1000M',
    //   node_args: '--max-old-space-size=896 --expose-gc',
    //   env: {
    //     NODE_ENV: 'production'
    //   },
    //   env_development: {
    //     NODE_ENV: 'development'
    //   },
    //   error_file: './logs/worker-error.log',
    //   out_file: './logs/worker-out.log',
    //   log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    //   merge_logs: true,
    //   autorestart: true,
    //   watch: false,
    //   max_restarts: 10,
    //   min_uptime: '10s',
    //   restart_delay: 4000,
    //   kill_timeout: 5000,
    //   cron_restart: '0 */6 * * *'
    // }
  ]
};