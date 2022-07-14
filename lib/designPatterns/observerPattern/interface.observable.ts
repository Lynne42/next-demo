
import { Observer } from './interface.observer';

export interface Subject {
    // new(): Subject;
    registerObserver(o: Observer): void;
    removeObserver(o: Observer ): void;
    notifyObservers(): void;
    setChanged(bool: boolean): void;
}