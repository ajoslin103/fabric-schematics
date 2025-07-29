// Add global object for Node.js compatibility
window.global = window;

// Make chai's expect available globally
window.expect = chai.expect;

// Debug check for fabric.js
console.log('Fabric version: ' + (window.fabric ? window.fabric.version : 'unknown'));
console.log('Fabric has Canvas: ' + !!window.fabric?.Canvas);
console.log('Fabric has Point: ' + !!window.fabric?.Point);

// Check for fabric-layers-core global
console.log('FabricLayers available: ' + !!window.FabricLayers);

// Set up test fixture container
const fixture = document.createElement('div');
fixture.id = 'test-fixture';
document.body.appendChild(fixture);
