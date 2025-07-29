// Map class test file for Karma browser-based testing

describe('Map Class Tests', function() {
  let mapInstance;
  let container;

  beforeEach(function() {
    // Make fabric available globally as it would be in a browser
    window.global = window;
    
    // Log fabric availability for debugging
    console.log('Fabric version:', window.fabric.version);
    console.log('Fabric has Canvas:', !!window.fabric.Canvas);
    console.log('Fabric has Point:', !!window.fabric.Point);
    
    // Create a container element to hold the map
    container = document.createElement('div');
    container.id = 'map-container';
    container.style.width = '800px';
    container.style.height = '600px';
    document.body.appendChild(container);
  });
  
  it('should initialize with a canvas', function() {
    // Initialize Map instance
    mapInstance = new FabricLayers.Map(container, {
      width: 800,
      height: 600
    });
    
    expect(mapInstance).to.exist;
    expect(mapInstance.canvas).to.exist;
    expect(mapInstance.canvas).to.be.an.instanceof(fabric.Canvas);
  });
  
  after(function() {
    // Clean up - remove the container from DOM
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });
  
  it('should initialize with a canvas', function() {
    expect(mapInstance.canvas).to.exist;
    expect(mapInstance.canvas).to.be.an.instanceof(window.fabric.Canvas);
  });
  
  it('should have correct default dimensions', function() {
    expect(mapInstance.canvas.width).to.equal(800);
    expect(mapInstance.canvas.height).to.equal(600);
  });
  
  it('should have the grid initialized when showGrid is true', function() {
    // Note: Grid is enabled by default in Map constructor
    expect(mapInstance.grid).to.exist;
  });
});
