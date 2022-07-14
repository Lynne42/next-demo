import ControllerInterface from "./controller.interface";
import ModalBeatInterface from "./modal.beat.interface";

class ControllerBeat implements ControllerInterface {
  modal: ModalBeatInterface;

  constructor(modal: ModalBeatInterface) {
    this.modal = modal;
  }
  on() {
    this.modal.on();
  }
  off() {
    this.modal.off();
  }
  quit() {
    this.modal.off();
  }
  setBPM(bpm: number) {
    this.modal.setBPM(bpm);
  }
  increase() {
    this.modal.increase();
  }
  decrease() {
    this.modal.decrease();
  }
}

export default ControllerBeat;
