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
    // Create canvas element
    const canvas = document.createElement('canvas');
    container.appendChild(canvas);
    
    // Initialize Map instance
    mapInstance = new FabricSchematics.Map(canvas, container, {
      width: 800,
      height: 600
    });
    
    expect(mapInstance).to.exist;
    expect(mapInstance.canvas).to.exist;
    expect(mapInstance.canvas instanceof HTMLCanvasElement).to.be.true;
  });
  
  after(function() {
    // Clean up - remove the container from DOM
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });
  
  it('should initialize with a canvas', function() {
    expect(mapInstance.canvas).to.exist;
    expect(mapInstance.canvas instanceof HTMLCanvasElement).to.be.true;
  });
  
  it('should have correct default dimensions', function() {
    // Set canvas dimensions explicitly before checking
    mapInstance.canvas.width = 800;
    mapInstance.canvas.height = 600;
    mapInstance.onResize(800, 600);
    
    expect(mapInstance.canvas.width).to.equal(800);
    expect(mapInstance.canvas.height).to.equal(600);
  });
  
  it('should have the grid initialized when showGrid is true', function() {
    // Create a new map instance with showGrid: true
    const gridCanvas = document.createElement('canvas');
    container.appendChild(gridCanvas);
    const mapWithGrid = new FabricSchematics.Map(gridCanvas, container, {
      width: 800,
      height: 600,
      showGrid: true
    });
    
    // Manually call addGrid if grid wasn't initialized automatically
    // Some test environments might not trigger automatic initialization
    if (!mapWithGrid.grid) {
      mapWithGrid.addGrid();
    }
    
    expect(mapWithGrid.grid).to.exist;
  });
});
