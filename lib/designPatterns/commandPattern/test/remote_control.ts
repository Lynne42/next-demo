import SimpleRemoteControl from '../invoker/simple_remote_control';

import LightOffCommand from '../command/light_off_command';
import LightOnCommand from '../command/light_on_command';
import Light from '../concrete/light';

import Command from '../command.interface';

import GarageDoor from '../concrete/garageDoor';
import GarageDoorUpCommand from '../command/garageDoor_up_command';


import GeilingfanHighCommand from '../command/geilingfan_high_command';
import GeilingfanMiddleCommand from '../command/geilingfan_middle_command';
import Geilingfan from '../concrete/geilingfan';

class RemoteControl {
    public remote: SimpleRemoteControl = new SimpleRemoteControl();
    public light:Light = new Light();
    public garageDoor: GarageDoor = new GarageDoor();
    public geilingfan: Geilingfan = new Geilingfan();
    // 记录执行的命令， 以便可以直接撤销上一个执行的命令
    public undoCommand: Command | null = null; 

    init() {

        const garageDoorUpCommand = new GarageDoorUpCommand(this.garageDoor)
        this.remote.setCommand(garageDoorUpCommand);
        this.undoCommand = garageDoorUpCommand;
        this.remote.run();

        const lightOnCommand = new LightOnCommand(this.light);
        this.remote.setCommand(lightOnCommand);
        this.undoCommand = lightOnCommand;
        this.remote.run();

        const lightOffCommand = new LightOffCommand(this.light);
        this.remote.setCommand(lightOffCommand);
        this.undoCommand = lightOffCommand;
        this.remote.run();
        this.undoCommand.undo();

        const geilingfanHighCommand = new GeilingfanHighCommand(this.geilingfan);
        this.remote.setCommand(geilingfanHighCommand);
        this.undoCommand = geilingfanHighCommand;
        this.remote.run();

        const geilingfanMiddleCommand = new GeilingfanMiddleCommand(this.geilingfan);
        this.remote.setCommand(geilingfanMiddleCommand);
        this.undoCommand = geilingfanMiddleCommand;
        this.remote.run();

        this.undoCommand.undo();

    }
}

export default RemoteControl;