// assets/scripts/GameScene.ts
import { _decorator, Component } from 'cc';
import { SceneManager } from './SceneManager';
const { ccclass, property } = _decorator;

@ccclass('GameScene')
export class GameScene extends Component {
    onLoad() {
        // init
    }

    endGame() {
        SceneManager.instance.loadScene('LobbyScene');
    }
}
