
/** ****************     start   ***************** 

一个天气的观察者类:

属性：
- 温度
- 湿度
- 压强

方法：

- 返回各个属性
****************     end   ***************** */


import Observable from "./observable";

class WeatherData extends Observable {
  private temperature: number = 0;
  private humidity: number = 0;
  private pressure: number = 0;

  // 设置数据源
  setMeasurements(temp: number, humidity: number, pressure: number) {
    this.temperature = temp;
    this.humidity = humidity;
    this.pressure = pressure;
    this.measurementsChanged();
  }

  /**
   * 气象数据(温度，湿度，气压)更新后，会调用该方法
   */
  measurementsChanged() {
    // 数据更新后， 向观察者发布数据
    this.setChanged(true);
    this.notifyObservers();
  }

  public getTemperature() {
    return this.temperature;
  }

  public getHumidity() {
    return this.humidity;
  }

  public getPressure() {
    return this.pressure;
  }
}


const weatherData = new WeatherData();

export default weatherData;