
/** ****************     start   ***************** 

通用的可观察者类:

属性：
- 观察者集合
- 一个是否通知观察者的开关

方法：

- 实现注册观察者
- 实现移除观察者
- 实现通知观察者
****************     end   ***************** */


import type { Observer } from './interface.observer';
import type { Subject } from './interface.observable';

class Observable implements Subject {

    private observers: Observer[] = [];
    private isChanged: boolean = false;

    constructor() {

    }

    setChanged(bool?: boolean) {
        this.isChanged = true;
    }

    // 注册
    registerObserver(o: Observer): void {
        this.observers.push(o);
    }

    // 移除
    removeObserver(o: Observer): void {
        const i = this.observers.indexOf(o);
        if(i >= 0) {
            this.observers.splice(i, 1)
        }
    }

    // 消息发布
    notifyObservers(): void {
        if(this.isChanged) {
            for(let i = 0, len = this.observers.length; i < len; i++) {
                this.observers[i].update(this.observers[i])
            }
            this.isChanged = false;
        }
    }
}

export default Observable;