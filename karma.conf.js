// Karma configuration file
module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use - using CDN versions instead
    frameworks: [],

    // list of files / patterns to load in the browser
    files: [
      // Load testing libraries from CDN
      'https://cdnjs.cloudflare.com/ajax/libs/mocha/10.2.0/mocha.js',
      'https://cdnjs.cloudflare.com/ajax/libs/chai/4.3.7/chai.js',
      // Load fabric.js from CDN
      'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js',
      // Test setup file to configure Mocha - IMPORTANT: This must run before test files
      { pattern: 'test/karma/test-setup.js', included: true, served: true },
      // Load the distribution build of our library
      { pattern: 'dist/index.umd.js', included: true, served: true },
      // Then load test files
      { pattern: 'test/karma/**/*.spec.js', included: true, served: true, watched: true }
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    preprocessors: {},
    
    // setup for client tests
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd',
        timeout: 5000
      }
    },

    // test results reporter to use
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,
    
    // Display error details
    client: {
      mocha: {
        reporter: 'html',
        ui: 'bdd'
      }
    }
  });
};
