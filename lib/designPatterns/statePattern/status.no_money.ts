import StatusInterface from "./interface.status";

import { Status } from './interface.status';


class StatusNoMoney implements StatusInterface {
  public instance: any;
  constructor(instance: any) {
    this.instance = instance;
  }
  insertYuan() {
    console.log('投入硬币');
    this.instance.updateStatus(Status.has_money);
    
  }

  ejectYuan() {
    console.log('请先投入硬币');
    
  }

  turnSelect() {
    console.log('请先投入硬币');
  }

  dispense() {
    console.log('请先投入硬币');
    
  }
}

export default StatusNoMoney;
