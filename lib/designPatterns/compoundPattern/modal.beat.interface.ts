
import Observer from './interface.observer';

interface ModalBeatInterface {
  initialize(): void;
  on(): void;
  off(): void;
  quit(): void;
  setBPM(bpm: number): void;
  getBpm(): number;
  
  increase(): void;
  decrease(): void;
  
  setAction(action: string): void;
  getAction(): string;

  registerBeatObserver(o: Observer): void;
  removeBeatObserver(o: Observer): void;

  registerBpmObserver(o: Observer): void;
  removeBpmObserver(o: Observer): void;

  notifyBpmObservers(): void;
  notifyBeatObservers(): void;
}

export default ModalBeatInterface;
