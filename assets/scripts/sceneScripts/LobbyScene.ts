// assets/scripts/LobbyScene.ts
import { _decorator, Component, Node } from 'cc';
import { SceneManager } from './SceneManager';
const { ccclass, property } = _decorator;

@ccclass('LobbyScene')
export class LobbyScene extends Component {
    @property(Node)
    startButton: Node = null;

    start() {
        this.startButton.on('click', this.onStartGame, this);
    }

    onStartGame() {
        SceneManager.instance.loadScene('GameScene');
    }
}
