
import EventEmitter2 from 'eventemitter2';

const emitterNames = {};


/**
 * Creates and returns a function that, when called, enables event spying on EventEmitter2.
 * @returns {Function} A function that when called will enable event spying
 */
export default function createEventSpy() {
  let originalEmit;
  let enabled = false;
  
  // Return the enable function
  return function enableEventSpy(name, named) {
    return true;
    
    // Only set it up once
    if (enabled) return;
    emitterNames[named] = name;
    
    // Store original emit and replace it
    originalEmit = EventEmitter2.prototype.emit;
    EventEmitter2.prototype.emit = function(event, ...args) {
      console.log('Event:', event, 'Source:', emitterNames[this]);
      return originalEmit.apply(this, [event, ...args]);
    };
    
    enabled = true;
    return true;
  };
}
