import { IStateMachine } from "scripts/libs/state-machine/IStateMachine";
import { StateMachine } from "scripts/libs/state-machine/StateMachine";
import { ActionState } from "./states/ActionState";
import { PlaningState } from "./states/PlanningState";

export class GameStateMachine extends StateMachine implements IStateMachine {

  constructor(model: any, stateEnum: any) {
    super(model, stateEnum);
  }

  init(stateEnum: any): void {
    super.init(stateEnum);

    this.addState(PlaningState, stateEnum.PLANING);
    this.addState(ActionState, stateEnum.ACTION);
  }
}