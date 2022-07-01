import Command from '../command.interface';
import { SpeedStatus } from '../concrete/geilingfan';

class GeilingfanMiddleCommand implements Command {
    private geilingfan: any;
    public preSpeed: SpeedStatus | '' = '';

    constructor(geilingfan: any) {
        this.geilingfan = geilingfan;
    }

    execute(): void {
        this.preSpeed = this.geilingfan.getSpeed();
        
        this.geilingfan.setSpeedMiddle();
        this.geilingfan.setOn();
        
    }

    undo(): void {
        if(this.preSpeed === SpeedStatus.high) {
            this.geilingfan.setSpeedHigh();
        } else if(this.preSpeed === SpeedStatus.middle) {
            this.geilingfan.setSpeedMiddle();
        } else if(this.preSpeed === SpeedStatus.low) {
            this.geilingfan.setSpeedLow();
        } else {
            this.geilingfan.setOff();
        }
    }
}

export default GeilingfanMiddleCommand;