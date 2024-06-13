import { BaseState } from "scripts/libs/state-machine/BaseState";
import { GameStates } from "../StatesEnum";
import EventManager from "scripts/libs/state-machine/events/EventManager";
import { GameEvents } from "scripts/gameEvents/GameEvents";
import GameSettings from "scripts/settings/GameSettings";

export class PlaningState extends BaseState {
  
  begin(data?: any) {
    EventManager.dispatch(GameEvents.PLANING_START, {
      duration: GameSettings.PLANING_DURATION
    });    
    setTimeout(this.end, GameSettings.PLANING_DURATION * 1000);  
  }

  end = (): void => {
    EventManager.dispatch(GameEvents.PLANING_END);
    this.stateMachine.setState(GameStates.ACTION);
  }

  cleanUp(): void {
    
  }
}