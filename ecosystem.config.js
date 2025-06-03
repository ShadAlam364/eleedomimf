module.exports = {
  apps: [
    // Backend (Node.js)
    {
      name: "backend",
      script: "npm",
      args: "start",
      cwd: "/var/www/eleedom/backend",
      watch: true,
      ignore_watch: ['node_modules'],
      env: {
        NODE_ENV: "production",
        PORT: 7000
      }
    },
    // Frontend (Vite)
    // {
    //   name: "frontend",
    //   script: "npm",
    //   args: "run dev",  // Note the "run" here
    //   cwd: "/var/www/eleedom/frontend",
    //   watch: true,
    //   env: {
    //     NODE_ENV: "production",
    //     PORT: 5173
    //   }
    // },
    {
      name: 'frontend',
      script: 'serve',  // Make sure 'serve' is installed globally or in node_modules
      interpreter: 'node',  // Explicitly use Node as interpreter
      args: '-s dist -l 3000',  // Changed to string format instead of array
      cwd: '/var/www/eleedomimf/frontend',  // Double-check this path is correct
      watch: true,
      env: {
        NODE_ENV: 'production'
      }
    },
  ],
}