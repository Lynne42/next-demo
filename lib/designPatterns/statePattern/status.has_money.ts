import StatusInterface from "./interface.status";

import { Status } from './interface.status';


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
    this.instance.updateStatus(Status.no_money);
  }

  turnSelect() {
    console.log('选择产品');
    this.instance.updateStatus(Status.sold);
    this.dispense();
  }

  dispense() {
    console.log('售出产品');
    const count = this.instance.decreaseCount();

    let nowStatus = '';
    if(count > 0) {
        nowStatus = Status.no_money;
    } else {
        nowStatus = Status.sold_out;
    }

    this.instance.updateStatus(nowStatus);
  }
}

export default StatusHasMoney;
