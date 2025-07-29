/* global describe, it, before */

const chai = require('chai');
const fabric = require('fabric').fabric;
const { Map, Marker } = require('../src');

global.fabric = fabric;

chai.expect();
const expect = chai.expect;

let lib;

describe('Map Class Tests', () => {
  before(() => {
    // Use the test container from setup
    const testContainer = global.testContainer || document.body;
    lib = new Map(testContainer, {
      width: 800,
      height: 600
    });
  });
  
  it('should initialize with a canvas', () => {
    expect(lib.canvas).to.exist;
    expect(lib.canvas).to.be.instanceof(FabricLayersPaintingCanvas);
  });
});

describe('Marker Class Tests', () => {
  before(() => {
    lib = new Marker({
      left: 0,
      top: 0,
      size: 10,
      stroke: '#000000',
      fill: '#ff0000'
    });
  });
  
  it('should initialize with correct type', () => {
    expect(lib.type).to.equal('marker');
  });
});