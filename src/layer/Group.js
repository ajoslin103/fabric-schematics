import { Group } from 'fabric';
import { FabricLayersPoint } from '../geometry/Point';

export class FabricLayersGroup extends Group {
  constructor(objects, options) {
    options = options || {};
    super(objects, options);
  }

  getBounds() {
    const coords = [];
    coords.push(new FabricLayersPoint(this.left - this.width / 2.0, this.top - this.height / 2.0));
    coords.push(new FabricLayersPoint(this.left + this.width / 2.0, this.top + this.height / 2.0));
    return coords;
  }
}

export default FabricLayersGroup;
