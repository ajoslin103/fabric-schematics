// Marker class test file for Karma browser-based testing

describe('Marker Class Tests', function() {
  it('Marker class should be exported', function() {
    // Debug: Log what's available in FabricLayers
    console.log('FabricLayers available:', !!window.FabricLayers);
    console.log('FabricLayers keys:', Object.keys(window.FabricLayers || {}));
    console.log('FabricLayers contents:', window.FabricLayers);
    
    // Verify the Marker class is available
    expect(window.FabricLayers).to.exist;
    expect(window.FabricLayers.Marker).to.exist;
    expect(typeof window.FabricLayers.Marker).to.equal('function');
  });
  
  it('Marker class should have the right prototype chain', function() {
    if (!window.FabricLayers || !window.FabricLayers.Marker) {
      this.skip();
      return;
    }
    
    // Test the structure of the Marker class without instantiating
    const Marker = window.FabricLayers.Marker;
    const proto = Marker.prototype;
    
    // Check that key methods exist on the prototype
    expect(proto).to.have.property('init');
    expect(proto).to.have.property('setPosition');
    expect(proto).to.have.property('setColor');
    expect(proto).to.have.property('setSize');
  });
});

