import ModalBeatInterface from "./modal.beat.interface";
import Observer from './interface.observer';

class ModalBeat implements ModalBeatInterface {
  sequencer: any;
  observerBeat: Observer[] = [];
  observerBpm: Observer[] = [];
  bpm: number = 90;
  action: string = '';

  initialize() {
    this.setBPM(0);
    this.setAction('init');
  }

  on() {
    this.setBPM(90);
    this.setAction('start');
  }
  off() {
    this.setBPM(0);
    this.setAction('off');
  }

  increase() {
    this.setBPM(this.bpm + 1);
    this.setAction('increase');
  }
  decrease() {
    this.setBPM(this.bpm - 1);
    this.setAction('decrease');
  }

  quit() {
    this.initialize();
    this.setAction('quit');
  }

  setBPM(bpm: number) {
    this.bpm = bpm;
    this.notifyBpmObservers();
  }
  getBpm() {
    return this.bpm;
  }

  setAction(action: string) {
    this.action = action;
    this.notifyBeatObservers();
  }

  getAction() {
    return this.action;
  }

  registerBeatObserver(o: Observer) {
    this.observerBeat.push(o);
  }
  removeBeatObserver(o: Observer) {
    const i = this.observerBeat.indexOf(o);
    if (i >= 0) {
      this.observerBeat.splice(i, 1);
    }
  }

  registerBpmObserver(o: Observer) {
    this.observerBpm.push(o);
  }
  removeBpmObserver(o: Observer) {
    const i = this.observerBpm.indexOf(o);
    if (i >= 0) {
      this.observerBpm.splice(i, 1);
    }
  }

  getObserverData() {
    return {
      bpm: this.bpm,
      action: this.action,
    }
  }

  notifyBpmObservers() {
    for (let index = 0; index < this.observerBpm.length; index++) {
      const element = this.observerBpm[index];
      element.update(element, this.getObserverData());
    }
  }

  notifyBeatObservers() {
    for (let index = 0; index < this.observerBeat.length; index++) {
      const element = this.observerBeat[index];
      element.update(element, this.getObserverData());
    }
  }
}

export default ModalBeat;
