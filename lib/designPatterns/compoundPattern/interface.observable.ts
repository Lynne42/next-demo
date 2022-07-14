
import  Observer  from './interface.observer';

export default interface Subject {
    // new(): Subject;
    registerObserver(o: Observer): void;
    removeObserver(o: Observer ): void;
    notifyObservers(): void;
    setChanged(bool: boolean): void;
}