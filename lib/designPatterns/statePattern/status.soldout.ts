import StatusInterface from "./interface.status";


class StatusSoldout implements StatusInterface {
  public instance: any;
  constructor(instance: any) {
    this.instance = instance;
  }
  insertYuan() {
    console.log('已售罄，不能投入硬币');
    
  }

  ejectYuan() {
    console.log('已售罄，不能投入硬币');
    
  }

  turnSelect() {
    console.log('已售罄，不能选择产品');
    
  }

  dispense() {
    console.log('已售罄，不能售出产品');
    
  }
}

export default StatusSoldout;
