import { _decorator, Component } from 'cc';
import { GameEvents } from 'scripts/gameEvents/GameEvents';
import EventManager from 'scripts/libs/state-machine/events/EventManager';
import { PlayerComponent } from './PlayerComponent';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {
    
    onLoad() {
        EventManager.add(GameEvents.PLANING_START, this.onPlaningStart)
        EventManager.add(GameEvents.ACTION_START, this.onActionStart)
    }

    private onPlaningStart = (): void => {
        this.node.getComponent(PlayerComponent).allow(true);
    }

    private onActionStart = (): void => {
        this.node.getComponent(PlayerComponent).allow(false);
        this.node.getComponent(PlayerComponent).go();
    }
}


