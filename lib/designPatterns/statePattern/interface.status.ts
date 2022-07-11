export enum Status {
    'sold_out' = 'sold_out',
    'sold' = 'sold',
    'has_money' = 'has_money',
    'no_money' = 'no_money',
}

interface StatusInterface {
    insertYuan(): void;
    ejectYuan(): void;
    turnSelect(): void;
    dispense(): void;
}

export default StatusInterface;