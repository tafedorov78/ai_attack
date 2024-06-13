import { CCInteger, Component, Vec3, _decorator, v3 } from 'cc';
import { PathPoint } from 'scripts/libs/path-finder/Astar';
import GameSettings from 'scripts/settings/GameSettings';
import { GlobalState } from '../settings/GlobalState';
const { ccclass, property } = _decorator;

@ccclass('MovementController')
export class MovementController extends Component {
    
    @property({type: CCInteger})
    speed: number = 2;
    
    @property({type: CCInteger})
    BLOCKING_TIMES: number = 2;

    private path: PathPoint[];
    private nextPoint: PathPoint;
    private nextPlus1Point: PathPoint;
    private nextPosition: Vec3;
    private currentStepIndex: number = 0;
    private isMoving: boolean = false;
    private blockingCounter: number = 0;
    private playerId: number = 0;

    public onComplete: Function;

    public setPlayerId(id: number): void {
        this.playerId = id;
    }
    
    public startMove(path: PathPoint[], startPoint: PathPoint) {
        this.path = path;
        this.currentStepIndex = -1;
        this.updatePlayerPosition(this.playerId, startPoint);
        this.nextStep();
        this.schedule(this.updateMovement, 0.01);
    }

    private nextStep() {
        if(this.currentStepIndex + 1 <= this.path.length - 1) {
            this.currentStepIndex++;
            this.nextPoint = this.path[this.currentStepIndex];
            this.nextPlus1Point = this.currentStepIndex + 1 <= this.path.length - 1 ? this.path[this.currentStepIndex + 1] : null;
            this.nextPosition = v3(this.nextPoint.j * GameSettings.TILE_SIZE, this.nextPoint.i * GameSettings.TILE_SIZE, 1);
        } else {
            this.moveCompleted(true, this.path[this.currentStepIndex > 0 ? this.currentStepIndex - 1 : 0]);
        }
        this.isMoving = true;
    }

    protected updateMovement(): void {
        if (!this.isMoving) {
            return;
        }
        const currentPosition = this.node.getPosition();

        const p = this.nextPlus1Point || this.nextPoint;
        
        if (this.isCollidingWithOtherPlayers(p)) {
            this.blockingCounter++;
            if(this.blockingCounter > this.BLOCKING_TIMES) {
                this.isMoving = false;
                this.moveCompleted(false, this.path[this.currentStepIndex > 0 ? this.currentStepIndex - 1 : 0]);
            }
            return; 
        }
        this.blockingCounter = 0;
        this.updatePlayerPosition(this.playerId, this.nextPoint);
        const dx = this.nextPosition.x - currentPosition.x;
        const dy = this.nextPosition.y - currentPosition.y;
        const angle = Math.atan2(dy, dx);

        currentPosition.x += Math.cos(angle) * this.speed;
        currentPosition.y += Math.sin(angle) * this.speed;

        const distanceToTarget = Math.sqrt(dx * dx + dy * dy);
        if (distanceToTarget < this.speed) {
            this.node.setPosition(this.nextPosition);
            this.nextStep();
        } else {
            this.node.setPosition(v3(currentPosition));
        } 
    }

    private updatePlayerPosition(playerId, point: PathPoint) {
        GlobalState.playerPositions.set(playerId, point);
    }

    private isCollidingWithOtherPlayers(targetPosition: PathPoint): boolean {
        for (let [playerId, position] of GlobalState.playerPositions) {
            if (playerId !== this.playerId && position.i === targetPosition.i && position.j === targetPosition.j) {
                return true;
            }
        }
        return false;
    }

    private moveCompleted = (wasSuccessed: boolean, lastPoint?: PathPoint): void => {
        this.unschedule(this.updateMovement);
        this.onComplete(wasSuccessed, lastPoint);
    }

    public setOnComplete = (callback: Function): void => {
        this.onComplete = callback;
    }
}