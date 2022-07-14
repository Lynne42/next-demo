import ModalBeatInterface from "./modal.beat.interface";
import ControllerInterface from "./controller.interface";

class BpmView {
  bpm: number = 0;
  modal: ModalBeatInterface;
  controller: ControllerInterface;

  constructor(controller: ControllerInterface, modal: ModalBeatInterface) {
    this.controller = controller;
    this.modal = modal;

    this.modal.registerBpmObserver(this);
  }

  update(that: any, data: any) {
    console.log("view-observer", data.bpm);
  }

  print() {
    return this.modal.getBpm();
  }
}

export default BpmView;
