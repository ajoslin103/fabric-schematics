// test.setup.cjs
const { JSDOM } = require('jsdom');
const Canvas = require('canvas');

// Set up canvas for Node.js environment first
const canvas = Canvas.createCanvas(800, 600);
const ctx = canvas.getContext('2d');

// Initialize JSDOM before fabric
const dom = new JSDOM('<!doctype html><html><body><div id="test-container"></div></body></html>', {
  url: 'http://localhost',
  pretendToBeVisual: true,
  resources: 'usable'
});

// Set up global environment
global.window = dom.window;
global.document = dom.window.document;
global.Document = dom.window.Document;
global.HTMLDocument = dom.window.HTMLDocument;
global.navigator = { userAgent: 'node.js' };

// Set up canvas for fabric.js in Node.js
global.HTMLCanvasElement = Canvas.createCanvas(800, 600).constructor;
global.HTMLImageElement = Canvas.Image;
global.Image = Canvas.Image;
global.CanvasRenderingContext2D = Canvas.CanvasRenderingContext2D || Canvas.createCanvas(1, 1).getContext('2d').constructor;

// Mock requestAnimationFrame
global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0);
};
global.cancelAnimationFrame = function(id) {
  clearTimeout(id);
};

// Create a proper container for tests
global.testContainer = global.document.getElementById('test-container');

// Set up fabric after environment is configured
const fabricModule = require('fabric').fabric;
if (typeof global !== 'undefined') {
  global.fabric = fabricModule;
  global.window.fabric = fabricModule;
}

// Additional Node.js compatibility
if (!global.ImageData) {
  global.ImageData = Canvas.ImageData;
}