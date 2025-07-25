module.exports = {
  apps: [
    {
      name: "calenderConflits",
      script: "app.js",
      watch: true,
      ignore_watch: ["node_modules", "logs", "public"], // Add directories to ignore
      watch_options: {
        followSymlinks: false,
      },
    },
  ],
};
