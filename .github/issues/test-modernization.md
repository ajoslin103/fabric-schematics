Test Suite Modernization

Need to update the test suite to use browser-based testing since this is primarily a browser library that depends heavily on canvas functionality.

Tasks:
1. Switch from Node-based testing to Karma + Chrome
2. Set up karma.conf.js with proper webpack configuration
3. Update test files to work in browser environment
4. Add test coverage reporting
5. Add visual regression testing for canvas elements

Current issues:
- Node-based tests fail due to canvas requirements
- JSDOM limitations with fabric.js
- Need proper browser environment for accurate testing

Related changes:
- Remove current test setup (setup.js, etc.)
- Add Karma + Chrome setup
- Update CI configuration if needed