import { _decorator, CCBoolean, Component, Vec2 } from 'cc';
import { Draggable } from 'scripts/draggable/Draggable';
import { aStar, PathPoint } from 'scripts/libs/path-finder/Astar';
import GameSettings from 'scripts/settings/GameSettings';
import { GlobalState } from '../settings/GlobalState';
import { MovementController } from './MovementController';
const { ccclass, property } = _decorator;

@ccclass('PlayerComponent')
export class PlayerComponent extends Component {
    
    @property
    playerId: number = 0;
    
    @property({type: CCBoolean})
    avoidObstacles: boolean = true;
    
    private startPoint: PathPoint = null;
    private endPoint: PathPoint = null;
    private path: PathPoint[] = null;

    private isAllowed: boolean = false;
    private isEditing: boolean = false;

    protected onLoad(): void {
        this.getComponent(Draggable).isMoving = false;
        this.getComponent(Draggable).setStartCallback(this.onStart);
        this.getComponent(Draggable).setEndCallback(this.onEnd);
        this.getComponent(MovementController).setPlayerId(this.playerId);
        this.getComponent(MovementController).setOnComplete(this.onCompleteMove);
    }

    public allow(value: boolean) {
        this.isAllowed = value;
    }

    private reset(): void {
        this.startPoint = null;
        this.endPoint = null;
    }

    public onStart = (point: Vec2): void => {
        if(!this.isAllowed) return;
        this.isEditing = true;
        this.startPoint = this.vec2ToPathPoint(point);
     }
    
    public onEnd = (point: Vec2): void => {
        if (!this.isAllowed || !this.isEditing) return;
        this.isEditing = false;
        this.endPoint = this.vec2ToPathPoint(point);
    }

    public onCompleteMove = (wasSuccessed: boolean, lastPoint: PathPoint): void => {
        if (wasSuccessed) {
            this.reset();
            return;
        }

        if(!this.avoidObstacles) return;
        
        const newDynamicObjects = new Map(GlobalState.playerPositions);
        newDynamicObjects.delete(this.playerId);

        const startPoint: PathPoint = { i: lastPoint.i, j: lastPoint.j, cost: 0, heuristic: 0, total: 0 };
        this.move(startPoint, this.endPoint, newDynamicObjects);
    }

    public go() {
        if(!this.startPoint || !this.endPoint) {
            return;
        }
        this.move(this.startPoint, this.endPoint);
    }

    private move = (start: PathPoint, end: PathPoint, dynamicObjects?: Map<number, PathPoint>): void => {
        this.path = this.findPath(start, end, dynamicObjects);
        
        if (this.path) {
            console.log(this.path);
            this.getComponent(MovementController).startMove(this.path, start);
        }
    }
    
    private findPath = (start: PathPoint, end: PathPoint, dynamicObjects?: Map<number, PathPoint>): PathPoint[] => {
        console.log(`Start: ${start.i},${start.j}, End: ${end.i},${end.j}`);
        return aStar(GlobalState.Grid, start, end, GlobalState.blockers, dynamicObjects);
    }
    
    private vec2ToPathPoint = (vec: Vec2): PathPoint => {
        const i: number = Math.trunc(vec.y / GameSettings.TILE_SIZE);
        const j: number = Math.trunc(vec.x / GameSettings.TILE_SIZE);
        return {
            i: i,
            j: j,
            cost: 0,
            heuristic: 0,
            total: 0
        }; 
    }
}