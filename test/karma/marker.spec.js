// Marker class test file for Karma browser-based testing

describe('Marker Class Tests', function() {
  let markerInstance;
  
  beforeEach(function() {
    // Make fabric available globally as it would be in a browser
    window.global = window;
    
    // Debug: Check what global objects are available
    console.log('Available global objects:', Object.keys(window).filter(key => 
      ['fabric', 'Map', 'Marker', 'FabricLayers'].includes(key)));
    console.log('Window fabric-layers object:', window['fabric-layers']);
  });
  
  it('should initialize with correct type', function() {
    // Initialize Marker instance
    markerInstance = new FabricLayers.Marker({
      left: 0,
      top: 0,
      size: 10,
      stroke: '#000000',
      fill: '#ff0000'
    });
    
    expect(markerInstance).to.exist;
    expect(markerInstance.type).to.equal('marker');
  });
  
  it('should have the correct size and colors', function() {
    expect(markerInstance.size).to.equal(10);
    expect(markerInstance.stroke).to.equal('#000000');
    expect(markerInstance.fill).to.equal('#ff0000');
  });
});
