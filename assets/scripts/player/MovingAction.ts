import { _decorator, Component, Node, tween, Vec3 } from 'cc';
import { Point } from 'scripts/pathFinder/Astar';
import GameSettings from 'scripts/settings/GameSettings';
const { ccclass, property } = _decorator;

@ccclass('MovingAction')
export class MovingAction extends Component {

    private currentStepIndex: number = 0;
    private path: Point[] = null;

    public move(path: Point[], objectToMove: Node): void {
        this.path = path;
        this.currentStepIndex = 0;
        this.nextStep(objectToMove);
    }

    private nextStep(objectToMove: Node) {
        if(this.currentStepIndex < this.path.length) {
            this.moveTo(objectToMove, this.path[this.currentStepIndex]);
            console.log(this.currentStepIndex, 'move to: ', this.path[this.currentStepIndex]);
            
            this.currentStepIndex++;
        } else {
            this.moveCompleted();
        }
    }
    
    private moveTo(objectToMove: Node, point: Point): void {
            tween(objectToMove)
            .to(0.1, { position: new Vec3(
                    point.j * GameSettings.TILE_SIZE, 
                    point.i * GameSettings.TILE_SIZE, 
                    objectToMove.position.z) 
                })
                .call(() => {
                    this.nextStep(objectToMove);
                })
                .start();
    }

    private moveCompleted = (): void => {

    }

}


