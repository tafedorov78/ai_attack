// assets/scripts/MovementController.ts
import { Component, Vec2, Vec3, _decorator, v2, v3 } from 'cc';
import { PathPoint } from 'scripts/pathFinder/Astar';
import { GlobalState } from './GlobalState';
import GameSettings from 'scripts/settings/GameSettings';
const { ccclass, property } = _decorator;

@ccclass('MovementController')
export class MovementController extends Component {
    @property
    speed: number = 2;

    @property
    playerId: number = 0;
    
    private path: PathPoint[];
    private nextPoint: PathPoint;
    private nextPosition: Vec3;
    private currentStepIndex: number = 0;
    private isMoving: boolean = false;
    private blockingCounter: number = 0;

    public onComplete: Function;

    
    startMove(path: PathPoint[], startPoint: PathPoint) {
        this.path = path;
        this.currentStepIndex = 0;
        GlobalState.playerPositions.set(this.playerId, startPoint);
        this.nextStep();
        this.schedule(this.updateMovement, 0.01);

    }

    private nextStep() {
        if(this.currentStepIndex < this.path.length) {
            this.nextPoint = this.path[this.currentStepIndex];
            this.nextPosition = v3(this.nextPoint.j * GameSettings.TILE_SIZE, this.nextPoint.i * GameSettings.TILE_SIZE, 1);
             
            console.log(this.currentStepIndex, 'move to: ',this.nextPoint, this.nextPosition);
            this.currentStepIndex++;
        } else {
            this.moveCompleted(true, this.path[this.currentStepIndex - 1]);
        }
        this.isMoving = true;
    }

    protected updateMovement(): void {
         if (!this.isMoving) {
            return;
        }
        const currentPosition = this.node.getPosition();

        if (this.isCollidingWithOtherPlayers(this.nextPoint)) {
            this.blockingCounter++;
            if(this.blockingCounter > GameSettings.MAX_BLOCKING_TIMES) {
                this.isMoving = false;
                this.moveCompleted(false, this.path[this.currentStepIndex - 1]);
            }
            return; 
        }
        this.blockingCounter = 0;
        GlobalState.playerPositions.set(this.playerId, this.nextPoint);
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

    isCollidingWithOtherPlayers(targetPosition: PathPoint): boolean {
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