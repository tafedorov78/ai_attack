export interface IStateMachine {
  addState(StatesEnum: any, id: string): void;
  setState(id: string, data?: any, isSkipped?: boolean): void;
  getStateId(id: string): string;
}
