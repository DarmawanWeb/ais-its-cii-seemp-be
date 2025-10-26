// eslint-disable-next-line no-undef
module.exports = {
  apps: [
    {
      name: 'ais-be',
      script: './dist/bin/www.js',
      instances: 1,
      exec_mode: 'fork',
      node_args: '--max-old-space-size=3584 --expose-gc', 
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
      watch: false,
      max_restarts: 5,
      min_uptime: '30s', 
      restart_delay: 10000,
      kill_timeout: 10000, 
      listen_timeout: 10000,
      exp_backoff_restart_delay: 100,
      autorestart: true,
      max_memory_restart: '3500M'
    }
  ]
};