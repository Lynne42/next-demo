import Command from '../command.interface';

class SimpleRemoteControl {
    public cm: Command;

    public setCommand(command: Command) {
        this.cm = command;
    }

    public run() {
        this.cm.execute();
    }
}

export default SimpleRemoteControl;