import React, { useEffect, useState } from "react";

import WeatherDataObserver from "./observerPattern/weatherDataObserver";
import weatherData from './observerPattern/weatherData';


interface Props {}
const ObserverPattern: React.FunctionComponent<Props> = () => {
  const [dw, setWd] = useState<any>('');
  useEffect(() => {
    const weatherData1 = new WeatherDataObserver(weatherData);
    weatherData.setMeasurements(1,2,3);
    transform(weatherData1);
    
    setTimeout(() => {
      weatherData.setMeasurements(2,2,3);
      console.log(weatherData1.display())
      transform(weatherData1);
    }, 5000)
  }, []);

  const transform = (dw: any) => {
    const data = dw.display();
    setWd(`tem: ${data.temperature}, hum: ${data.humidity}, pressure: ${data.pressure}`)
     
  }

  return (
    <section>
      <h2 className="font-bold">ObserverPattern</h2>
      <span>{dw}</span>
    </section>
  );
};
export default ObserverPattern;
