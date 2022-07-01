export enum SpeedStatus {
  "high" = "high",
  "middle" = "middle",
  "low" = "low",
}

class Geilingfan {
  public speed: SpeedStatus | '' = '';
  public status: "on" | "off" = "off";

  /**
   * Speed
   */
  public getSpeed() {
    return this.speed;
  }

  public setSpeedHigh() {
    this.speed = SpeedStatus.high;
    
    console.log(this.speed);
  }
  public setSpeedMiddle() {
    this.speed = SpeedStatus.middle;
   
    console.log(this.speed);
  }
  public setSpeedLow() {
    this.speed = SpeedStatus.low;
   
    console.log(this.speed);
  }

  /**
   * setOn
   */
  public setOn() {
    this.status = 'on';
  }

  /**
   * setOff
   */
  public setOff() {
    this.status = 'off';
  }
}

export default Geilingfan;
