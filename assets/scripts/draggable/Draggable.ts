import { Component, EventTouch, Input, UITransform, Vec2, Vec3, _decorator, input } from 'cc';
const { ccclass } = _decorator;

@ccclass('Draggable')
export class Draggable extends Component {

    private _isDragging: boolean = false;
    private onStartCallback: Function = null;
    private onEndCallback: Function = null;

    public isMoving: boolean = true;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    onDestroy() {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

     private onTouchStart(event: EventTouch) {
        const touchLocation = event.getUILocation();
        const pos = new Vec3(touchLocation.x, touchLocation.y, 0);

        const rect = this.node.getComponent(UITransform)!.getBoundingBox();
        if (rect.contains(new Vec2(pos.x, pos.y))) {
            this._isDragging = true;
            this.onStartCallback && this.onStartCallback(touchLocation);
        }
    }

    private onTouchMove(event: EventTouch) {
         if (this._isDragging) {
            const touchLocation = event.getUILocation();
            const pos = new Vec3(touchLocation.x, touchLocation.y, 0);
            if(this.isMoving) this.node.setPosition(pos);
         }
    }

    private onTouchEnd(event: EventTouch) {
        this._isDragging = false;
        const touchLocation = event.getUILocation();
        //touchLocation.x -= 50;
        //touchLocation.y -= 150;
        const pos = new Vec3(touchLocation.x, touchLocation.y, 0);

        const rect = this.node.getComponent(UITransform)!.getBoundingBox();
        //if (rect.contains(new Vec2(pos.x, pos.y))) {
            this._isDragging = false;
            this.onEndCallback && this.onEndCallback(touchLocation);
       // }
    }

    public setStartCallback = (fn: Function): void => {
        this.onStartCallback = fn;
    }

    public setEndCallback = (fn: Function): void => {
        this.onEndCallback = fn;
    }


}