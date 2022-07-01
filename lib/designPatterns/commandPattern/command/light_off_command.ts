import Command from '../command.interface';

class LightOffCommand implements Command {
    private light: any;

    constructor(light: any) {
        this.light = light;
    }

    execute(): void {
        this.light.off();
    }

    undo(): void {
        this.light.on();
    }

}

export default LightOffCommand;