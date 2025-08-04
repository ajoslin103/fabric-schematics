import { Modes } from '../core/Constants';

const ModesMixin = superclass =>
  class extends superclass {
    /**
     * MODES
     */
    setMode(mode) {
      this.mode = mode;

      switch (mode) {
        case Modes.SELECT:
          this.fabric.isDrawingMode = false;
          this.fabric.interactive = true;
          this.fabric.selection = true;
          this.fabric.hoverCursor = 'default';
          this.fabric.moveCursor = 'default';
          break;
        case Modes.GRAB:
          this.fabric.isDrawingMode = false;
          this.fabric.interactive = false;
          this.fabric.selection = false;
          this.fabric.discardActiveObject();
          this.fabric.hoverCursor = 'move';
          this.fabric.moveCursor = 'move';
          break;

        default:
          break;
      }
    }

    setModeAsSelect() {
      this.setMode(Modes.SELECT);
    }

    setModeAsGrab() {
      this.setMode(Modes.GRAB);
    }

    isSelectMode() {
      return this.mode === Modes.SELECT;
    }

    isGrabMode() {
      return this.mode === Modes.GRAB;
    }
  };

export default ModesMixin;
