import { ICON } from '../../core/Constants';
import { Image } from 'fabric';

export class Icon extends Image {
  constructor(options) {
    super(options);
    this.defaults = Object.assign({}, ICON);
    Object.assign({}, this.defaults);
    Object.assign({}, this._options);
  }
}
export const icon = (options) => new Icon(options);
