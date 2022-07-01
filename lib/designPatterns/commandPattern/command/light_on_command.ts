import Command from '../command.interface';

class LightOnCommand implements Command {
    private light: any;

    constructor(light: any) {
        this.light = light;
    }
    execute(): void {
        this.light.on();
    }

    undo(): void {
        this.light.off();
    }

    
}

export default LightOnCommand;