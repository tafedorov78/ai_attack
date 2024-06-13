import { _decorator, Component, Label, Node, ProgressBar, tween } from 'cc';
import { GameEvents } from 'scripts/gameEvents/GameEvents';
import EventManager from 'scripts/libs/state-machine/events/EventManager';
import { PlayerComponent } from 'scripts/player/PlayerComponent';
const { ccclass, property } = _decorator;

@ccclass('UIComponent')
export class UIComponent extends Component {

    @property({type: ProgressBar})
    progressBar: ProgressBar;
    
    @property({type: Label})
    phaseLabel: Label;

   onLoad() {
        EventManager.add(GameEvents.PLANING_START, this.onPlaningStart)
        EventManager.add(GameEvents.ACTION_START, this.onActionStart)
    }

    private onPlaningStart = ({duration}): void => {
        this.phaseLabel.string = "Planing...";
        this.animateProgressBar(duration);

    }

    private onActionStart = ({duration}): void => {
        this.phaseLabel.string = "Action...";
        this.animateProgressBar(duration);
    }

    private animateProgressBar(duration: number): void {
        if (this.progressBar) {
            this.progressBar.progress = 0;

            tween(this.progressBar)
                .to(duration, { progress: 1 }, { easing: 'linear' })
                .start();
        }
    }

}
