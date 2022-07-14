import View from './view';
import ViewOption from './view.option';

import Modal from './modal.beat';

import Controller from './controller.beat';

class Root {

  view: View;
  viewOption: ViewOption;

  modal: Modal;

  controller: Controller;

  constructor() {
    this.modal = new Modal();
    this.controller = new Controller(this.modal);
    
    this.view = new View(this.controller, this.modal);
    this.viewOption = new ViewOption(this.controller, this.modal);

  }

  init(callback: Function) {
    let str = [];
    this.viewOption.on();
    str.push(`${this.view.print()}, ${this.viewOption.print()}`);

    this.viewOption.increase();
    str.push(`${this.view.print()}, ${this.viewOption.print()}`);

    this.viewOption.increase();
    str.push(`${this.view.print()}, ${this.viewOption.print()}`);

    this.viewOption.decrease();
    str.push(`${this.view.print()}, ${this.viewOption.print()}`);

    this.viewOption.off();

    str.push(`${this.view.print()}, ${this.viewOption.print()}`);
    
    callback(str)
  }


}

export default Root;
