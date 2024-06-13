import { IStateMachine } from "./IStateMachine"
import { BaseState } from "./BaseState"
import EventManager from "./events/EventManager"
import { StateMachineEvents } from "./StateMachineEvents"

export class StateMachine implements IStateMachine {
  model: any
  currentState: BaseState
  idsMap: Map<string, string>
  statesMap: Map<string, BaseState>
  currentStateName: string
  statesEnum: any

  constructor(model: any, stateEnum: object) {
    this.model = model
    this.currentState = null as any
    this.idsMap = new Map<string, string>()
    this.statesMap = new Map<string, BaseState>()
    this.currentStateName = ""
    this.init(stateEnum)
  }

  public init(stateEnum: any): void {
    this.statesEnum = stateEnum
  }

  public addState(StatesEnum: any, id: string): void {
    let stateId: string = this.getStateId(id) as string
    if (this.idsMap.has(stateId)) {
      throw new Error("State already defined: " + stateId)
    }
    this.idsMap.set(id, stateId)
    this.statesMap.set(id, new StatesEnum(this, id, this.model))
  }

  public getStateId(id: string): string {
    for (let name in this.statesEnum) {
      if (id === this.statesEnum[name]) {
        return name
      }
    }
  }

  public setState(id: string, data?: any, isSkipped?: boolean): void {
    if (this.currentState) {
      this.currentState.cleanUp()
    }
    this.currentState = this.statesMap.get(id) as BaseState
    this.currentStateName = this.idsMap.get(id) as string
    this.stateChanged(this.idsMap.get(id) as string, this.model)
    this.currentState.begin(data)
  }

  stateChanged(id: string, model: any) {
    console.log(`STATE CHANGED::${id}`);
    
    EventManager.dispatch(StateMachineEvents.STATE_CHANGED, id);
    model.currentState = this.currentStateName
  }
}
