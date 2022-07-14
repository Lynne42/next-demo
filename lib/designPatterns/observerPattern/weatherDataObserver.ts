/** ****************     start   ***************** 

一个天气的观察者类:

属性：
- 要观察的属性

方法：

- update方法，用于诶可观察者调用
- display: 使用数据

****************     end   ***************** */


import type { Observer } from "./interface.observer";
import type { Subject } from "./interface.observable";

class WeatherDataObserver implements Observer {
  private temperature: number = 0;
  private humidity: number = 0;

  private observer: Subject;

  constructor(wd: Subject) {
    this.observer = wd;
    this.observer.registerObserver(this);
  }

  public update(o: any, arg?: any): void {
    this.temperature = o.observer.temperature;
    this.humidity = o.observer.humidity;
    this.display();
  }

  public display() {
    return {
      temperature: this.temperature,
      humidity: this.humidity,
    };
  }
}

export default WeatherDataObserver;
