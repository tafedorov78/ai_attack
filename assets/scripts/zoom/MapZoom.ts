import { Camera, Component, EventMouse, Input, _decorator, input } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MapZoom')
export class MapZoom extends Component {
    @property({ type: Camera })
    public camera: Camera = null!;

    @property({ min: 200, max: 600, slide: true })
    public minZoom: number = 200;

    @property({ min: 200, max: 600, slide: true })
    public maxZoom: number = 600;

    start() {
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    onDestroy() {
        input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }

    onMouseWheel(event: EventMouse) {
        const scrollY = event.getScrollY();
        let newZoom = this.camera.orthoHeight - scrollY * 0.1; 
        newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, newZoom));
        this.camera.orthoHeight = newZoom;
    }
}
