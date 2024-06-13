import { BaseState } from "scripts/libs/state-machine/BaseState";
import { GameStates } from "../StatesEnum";
import { GameEvents } from "scripts/gameEvents/GameEvents";
import EventManager from "scripts/libs/state-machine/events/EventManager";
import GameSettings from "scripts/settings/GameSettings";

export class ActionState extends BaseState {
  
  begin(data?: any) {
    EventManager.dispatch(GameEvents.ACTION_START, {
      duration: GameSettings.ACTION_DURATION
    });    
    setTimeout(this.end, GameSettings.ACTION_DURATION * 1000);  
  }

  end = (): void => {
    EventManager.dispatch(GameEvents.ACTION_END);    
    this.stateMachine.setState(GameStates.PLANING);
  }

  cleanUp(): void {
    
  }
}