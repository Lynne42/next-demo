import ModalBeatInterface from "./modal.beat.interface";
import ControllerInterface from "./controller.interface";

import View from "./view.show";
import ViewOption from "./view.option";

class RootView {
  view: View;
  viewOption: ViewOption;

  bpm: number = 0;
  modal: ModalBeatInterface;
  controller: ControllerInterface;

  constructor(controller: ControllerInterface, modal: ModalBeatInterface) {
    this.controller = controller;
    this.modal = modal;

    this.modal.registerBpmObserver(this);
  }

  createView() {
    this.view = new View(this.controller, this.modal);
    this.viewOption = new ViewOption(this.controller, this.modal);
  }

  update(that: any, data: any) {
    console.log("view-root", data.bpm);
  }

  print() {
    return this.modal.getBpm();
  }
}

export default RootView;
