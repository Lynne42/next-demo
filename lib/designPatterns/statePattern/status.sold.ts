import StatusInterface from "./interface.status";

class StatusSold implements StatusInterface {
  public instance: any;
  constructor(instance: any) {
    this.instance = instance;
  }
  insertYuan() {
    console.log('已选择产品，不能重复投入硬币');

  }

  ejectYuan() {
    console.log('已出售，不能返回硬币');
   
  }

  turnSelect() {
    console.log('已选择产品，不能重复选择');
    
  }

  dispense() {
    console.log('售出产品');
    const count = this.instance.decreaseCount();

    let nowStatus = '';
    if(count > 0) {
        nowStatus = this.instance.statusNoMoney;
    } else {
        nowStatus = this.instance.statusSoldout;
    }

    this.instance.updateStatus(nowStatus);
  }
}

export default StatusSold;
