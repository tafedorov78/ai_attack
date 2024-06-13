import { StateMachine } from "./StateMachine";

export class BaseState {
  stateMachine: StateMachine;
  model: any;
  id: string;

  constructor(stateMachine: StateMachine, id: string, model: any) {
    this.stateMachine = stateMachine;
    this.model = model;
    this.id = id;
  }

  begin(data?: any) {}

  end = (data?: any) => {};

  cleanUp() {}
}
