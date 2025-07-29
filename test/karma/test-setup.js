// Initialize Mocha in the browser
mocha.setup({
  ui: 'bdd',
  reporter: 'spec'
});

// Make Mocha globals available
window.describe = window.describe || mocha.describe;
window.it = window.it || mocha.it;
window.before = window.before || mocha.before;
window.after = window.after || mocha.after;
window.beforeEach = window.beforeEach || mocha.beforeEach;
window.afterEach = window.afterEach || mocha.afterEach;

// Make chai's expect available globally
window.expect = chai.expect;

// Setup global object for Node.js compatibility
window.global = window;

// Log fabric and library availability to help with debugging
console.log(`Fabric version: ${window.fabric.version || 'unknown'}`);
console.log(`Fabric has Canvas: ${!!window.fabric.Canvas}`);
console.log(`Fabric has Point: ${!!window.fabric.Point}`);
console.log(`FabricLayers available: ${!!window.FabricLayers}`);

// Set up the fixture for dynamic test container
const fixture = document.createElement('div');
fixture.id = 'test-fixture';
document.body.appendChild(fixture);

// Override Karma's default behavior to run tests
window.__karma__.loaded = function() {
  // Run tests once all files are loaded
  mocha.run();
};
