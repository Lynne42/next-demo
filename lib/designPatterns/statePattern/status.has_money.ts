import StatusInterface from "./interface.status";


class StatusHasMoney implements StatusInterface {
  public instance: any;
  constructor(instance: any) {
    this.instance = instance;
  }
  insertYuan() {
    console.log('不能重复投入硬币');
  }

  ejectYuan() {
    console.log('返还硬币');
    this.instance.updateStatus(this.instance.statusNoMoney);
  }

  turnSelect() {
    console.log('选择产品');
    this.instance.updateStatus(this.instance.statusSold);
   
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

export default StatusHasMoney;
