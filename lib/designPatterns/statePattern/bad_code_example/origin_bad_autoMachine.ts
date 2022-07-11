enum Status {
    'sold_out' = 'sold_out',
    'sold' = 'sold',
    'has_money' = 'has_money',
    'no_money' = 'no_money',
}

class AutoMachine {

    // 记录当前售货机状态
    public status: Status = Status.sold_out;
    
    // 记录售货机内的产品数量
    public count: number = 0;

    constructor(count: number) {
        this.count = count;

        if(count > 0) {
            this.status = Status.no_money;
        }
    }

    /**
     * insert5Yuan, 投入钱 
     */
    public insertYuan() {
        if(this.status === Status.has_money) {
            console.log('已投入硬币，等待售出， 不能重复投入硬币');
        } else if(this.status === Status.sold_out) {
            console.log('已售罄');
        } else if(this.status === Status.sold) {
            console.log('已售出');
        } else if(this.status === Status.no_money) {
            this.status = Status.has_money;
            console.log('已投入硬币5元');
        }
    }

    /**
     * ejectYuan
     */
    public ejectYuan() {
        if(this.status === Status.has_money) {
            console.log('返回硬币');
            this.status = Status.no_money;
        } else if(this.status === Status.sold_out) {
            console.log('已售罄，不能投入硬币');
        } else if(this.status === Status.sold) {
            console.log('已购买商品，不能再退回硬币');
        } else if(this.status === Status.no_money) {
            console.log('未投入硬币，请先投入硬币');
        }
    }

    /**
     * turnSelect，选择商品
     */
    public turnSelect() {
        if(this.status === Status.has_money) {
            console.log('售出商品');
            this.status = Status.sold;
            this.dispense();

        } else if(this.status === Status.sold_out) {
            console.log('已售罄，不能选择商品');
        } else if(this.status === Status.sold) {
            console.log('已选择商品，不能重复选择');
        } else if(this.status === Status.no_money) {
            console.log('未投入硬币，请先投入硬币');
        }
    }

    /**
     * dispense: 发放商品
     */
    public dispense() {
        if(this.status === Status.has_money) {
            console.log('状态错误');

        } else if(this.status === Status.sold_out) {
            console.log('状态错误');
        } else if(this.status === Status.sold) {
            console.log('发放商品');

            this.count -= 1;
            if(this.count > 0) {
                this.status = Status.no_money;
            } else {
                this.status = Status.sold_out;
            }
        } else if(this.status === Status.no_money) {
            console.log('状态错误');
        }
    }
}

export default AutoMachine;