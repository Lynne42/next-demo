import View from './view.beat';
import ViewOption from './view.option';

import Modal from './modal.beat';

import Controller from './controller.beat';

class Root {

  view: View;

  modal: Modal;

  controller: Controller;

  constructor() {
    this.modal = new Modal();
    this.controller = new Controller(this.modal);
    
    this.view = new View(this.controller, this.modal);

    this.view.createView();
    
  }

  init(callback: Function) {
    let str = [];
    this.view.viewOption.on();
    str.push(`${this.view.print()}, ${this.view.viewOption.print()}`);

    this.view.viewOption.increase();
    str.push(`${this.view.print()}, ${this.view.viewOption.print()}`);

    this.view.viewOption.increase();
    str.push(`${this.view.print()}, ${this.view.viewOption.print()}`);

    this.view.viewOption.decrease();
    str.push(`${this.view.print()}, ${this.view.viewOption.print()}`);

    this.view.viewOption.off();

    str.push(`${this.view.print()}, ${this.view.viewOption.print()}`);

    callback(str)
  }


}

export default Root;
