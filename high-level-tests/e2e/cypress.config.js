const defineConfig = require('cypress').defineConfig;
const webpack = require("@cypress/webpack-preprocessor");
const addCucumberPreprocessorPlugin = require('@badeball/cypress-cucumber-preprocessor').addCucumberPreprocessorPlugin;
const getCompareSnapshotsPlugin = require('cypress-visual-regression/dist/plugin');

module.exports = defineConfig({
  e2e: {
    specPattern: "cypress/integration/**/*.feature",
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);

      on(
        "file:preprocessor",
        webpack({
          webpackOptions: {
            resolve: {
              extensions: [".ts", ".js"],
            },
            module: {
              rules: [
                {
                  test: /\.feature$/,
                  use: [
                    {
                      loader: "@badeball/cypress-cucumber-preprocessor/webpack",
                      options: config,
                    },
                  ],
                },
              ],
            },
          },
        })
      );
      getCompareSnapshotsPlugin(on, config);

      return config;
    },
  },
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
  retries: {
    runMode: 2
  }
});
