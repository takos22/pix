const { defineConfig } = require('cypress')

module.exports = defineConfig({
  env: {
    "APP_URL": "http://localhost:4200",
    "API_URL": "http://localhost:3000",
    "ORGA_URL": "http://localhost:4201"
  },
  video: false,
  blockHosts: [
    "*stats.pix.fr*",
    "*analytics.pix.fr*"
  ],
  screenshotsFolder: "cypress/snapshots/actual",
  trashAssetsBeforeRuns: true,
  projectId: "3cjm89",
  numTestsKeptInMemory: 0,
  viewportWidth: 1500,
  nodeVersion: "system",
  retries: {
    runMode: 2
  }
});
