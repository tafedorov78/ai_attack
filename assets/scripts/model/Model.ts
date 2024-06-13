import { _decorator, Component } from 'cc';
import { IStateMachine } from 'scripts/libs/state-machine/IStateMachine';
import { GameStateMachine } from './GameStateMachine';
import { GameStates } from './StatesEnum';
const { ccclass, property } = _decorator;

@ccclass('Model')
export class Model extends Component {

    private stateMachine: IStateMachine;

    start() {
        this.stateMachine = new GameStateMachine(this, GameStates);
        this.stateMachine.setState(GameStates.PLANING);
    }



}


