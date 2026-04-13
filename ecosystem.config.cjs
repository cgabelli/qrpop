module.exports = {
  apps: [
    {
      name: "qrpop-web",
      cwd: "/var/www/vhosts/qrpop.it/app",
      script: "node_modules/.bin/next",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000
      },
      watch: false,
      instances: "max",
      exec_mode: "cluster",
      max_memory_restart: "500M",
      error_file: "./logs/err.log",
      out_file: "./logs/out.log",
      merge_logs: true,
      time: true
    }
  ]
};
