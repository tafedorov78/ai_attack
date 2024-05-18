import { _decorator, Color, Component, Enum, Node, Sprite } from 'cc';
const { ccclass, property, executeInEditMode } = _decorator;

export enum TileType {
    BLOCK = 1,
    PASS = 0
}

Enum(TileType);

const TileTypeColorMap: Record<TileType, Color> = {
    [TileType.BLOCK]: new Color(255, 0, 0, 255), // red
    [TileType.PASS]: new Color(0, 255, 0, 255)  // green
}

@ccclass('TileComponent')
export class TileComponent extends Component {

    @property({ type: TileType })
    tileType : TileType = TileType.BLOCK;

    refresh() {
        let sprite = this.getComponent(Sprite);
        if (sprite) {
            sprite.color = TileTypeColorMap[this.tileType];        
        }
    }
}
