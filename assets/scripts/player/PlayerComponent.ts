import { _decorator, Component, Vec2 } from 'cc';
import Facade from 'scripts/Facade';
import { Draggable } from 'scripts/draggable/Draggable';
import { aStar, Point } from 'scripts/pathFinder/Astar';
import { MovingAction } from './MovingAction';
import GameSettings from 'scripts/settings/GameSettings';
const { ccclass, property } = _decorator;

export interface InputInterface {
    getStartPoint(callback: Function): void;
    getFinishPoint(callback: Function): void;
}

@ccclass('PlayerComponent')
export class PlayerComponent extends Component {

    private startPoint: Point = null;
    private endPoint: Point = null;
    private path: Point[] = null;

    protected onLoad(): void {
        this.getComponent(Draggable).isMoving = false;
        this.getComponent(Draggable) && this.getComponent(Draggable).setStartCallback(this.onStart);
        this.getComponent(Draggable) && this.getComponent(Draggable).setEndCallback(this.onEnd);
    }

    public onStart = (point: Vec2): void => {
        const i: number = Math.trunc(point.y / GameSettings.TILE_SIZE);
        const j: number = Math.trunc(point.x / GameSettings.TILE_SIZE);
        console.log('onStart', i, j);

        this.startPoint = {
            i: i,
            j: j,
            cost: 0,
            heuristic: 0,
            total: 0
        } ; 
    }
    
    public onEnd = (point: Vec2): void => {
        const i: number = Math.trunc(point.y / GameSettings.TILE_SIZE);
        const j: number = Math.trunc(point.x / GameSettings.TILE_SIZE);
        console.log('onEnd', i, j);

        this.path = this.findPath({i: this.startPoint.i, j: this.startPoint.j, cost: 0, heuristic: 0, total: 0}, {i: i, j: j, cost: 0, heuristic: 0, total: 0});
        if(this.path) {
            console.log(this.path);
            this.node.getComponent(MovingAction).move(this.path, this.node);
        }
    }

    private findPath = (start: Point, end: Point): Point[] => {
        const walkableCodes = new Set<number>([52,51,50]);
        return aStar(Facade.Grid, start, end, walkableCodes);
    }

    

}


