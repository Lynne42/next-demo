import ModalBeatInterface from "./modal.beat.interface";
import ControllerInterface from "./controller.interface";


class BpmViewOption {
  bpm: number = 0;
  modal: ModalBeatInterface;
  controller: ControllerInterface;

  constructor(controller: ControllerInterface, modal: ModalBeatInterface) {
    this.controller = controller;
    this.modal = modal;

    this.modal.registerBeatObserver(this);
  }

  update(that, data) {
    console.log("option-observer", data.action);
  }

  on() {
    this.controller.on();
  }
  off() {
    this.controller.off();
  }

  quit() {
    this.controller.off();
  }

  increase() {
    this.controller.increase();
  }

  decrease() {
    this.controller.decrease();
  }

  print() {
    return this.modal.getAction();
  }
}

export default BpmViewOption;
