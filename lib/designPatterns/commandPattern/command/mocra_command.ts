import Command from "../command.interface";

class MocraCommand implements Command {

    public commands: Command[] = [];

    constructor(commands: Command[]) {
        this.commands = commands;
    }

    execute(): void {
        for (let index = 0; index < this.commands.length; index++) {
            const element = this.commands[index];
            element.execute();
        }
    }

    undo(): void {
        for (let index = 0; index < this.commands.length; index++) {
            const element = this.commands[index];
            element.undo();
        }
    }
}

export default MocraCommand;