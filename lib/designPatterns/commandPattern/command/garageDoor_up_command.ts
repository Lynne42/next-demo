import Command from '../command.interface';

class GarageDoorUpCommand implements Command {
    private garageDoor: any;

    constructor(garageDoor: any) {
        this.garageDoor = garageDoor;
    }
    execute(): void {
        this.garageDoor.up();
    }

    undo(): void {
        this.garageDoor.down();
    }

}

export default GarageDoorUpCommand;