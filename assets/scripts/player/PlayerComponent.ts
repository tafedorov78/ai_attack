import { _decorator, CCString, Component, Vec2 } from 'cc';
import Facade from 'scripts/Facade';
import { Draggable } from 'scripts/draggable/Draggable';
import { aStar, PathPoint } from 'scripts/pathFinder/Astar';
import GameSettings from 'scripts/settings/GameSettings';
import { MovementController } from './MovementController';
import { GlobalState } from './GlobalState';
const { ccclass, property } = _decorator;

@ccclass('PlayerComponent')
export class PlayerComponent extends Component {

    private startPoint: PathPoint = null;
    private endPoint: PathPoint = null;
    private path: PathPoint[] = null;

    private draggableController: Draggable;
    private movementController: MovementController;

    protected onLoad(): void {
        this.draggableController = this.getComponent(Draggable);
        this.movementController = this.getComponent(MovementController);

        this.draggableController.setStartCallback(this.onStart);
        this.draggableController.setEndCallback(this.onEnd);
        this.movementController.setOnComplete(this.onCompleteMove);
    }

    public onStart = (point: Vec2): void => {
        this.startPoint = this.vec2ToPathPoint(point);
    }
    
    public onEnd = (point: Vec2): void => {
        if(!this.startPoint) return;
        this.endPoint = this.vec2ToPathPoint(point);
        this.move(this.startPoint, this.endPoint)
    }

    public onCompleteMove = (wasSuccessed: boolean, lastPoint: PathPoint): void => {
        console.log(lastPoint);
        if(wasSuccessed) {
            
            return;
        }
        this.move(lastPoint, this.endPoint)
    }

    private move(start: PathPoint, end: PathPoint) {
        this.path = this.findPath(start, end);
        
        if(this.path) {
            console.log(this.path);
            this.movementController.startMove(this.path, this.startPoint);
            this.startPoint = null;
        }
    }
    
    private findPath = (start: PathPoint, end: PathPoint): PathPoint[] => {
        return aStar(Facade.Grid, start, end, GlobalState.blockers);
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
        } ; 
    }

}


