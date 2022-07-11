import { Status } from './interface.status';

import StatusInterface from './interface.status';

import StatusHasMoney from './status.has_money';
import StatusNoMoney from './status.no_money';
import StatusSold from './status.sold';
import StatusSoldout from './status.soldout';

class AutoMachine {

    public statusHasMoney:StatusInterface;
    public statusNoMoney:StatusInterface;
    public statusSold:StatusInterface;
    public statusSoldout:StatusInterface;

    public status: StatusInterface;

    public count: number = 0;

    constructor(count: number) {
        this.count = count;
        this.statusHasMoney = new StatusHasMoney(this);
        this.statusNoMoney = new StatusNoMoney(this);
        this.statusSold = new StatusSold(this);
        this.statusSoldout = new StatusSoldout(this);

        if(count > 0) {
            this.status = this.statusNoMoney;
        } else {
            this.status = this.statusSoldout;
        }
    }

    /**
     * updateStatus
     */
    public updateStatus(status: StatusInterface) {
        this.status = status;
    }


    /**
     * name
     */
    public decreaseCount() {
        this.count -= 1;
        return this.count;
    }
}

export default AutoMachine;