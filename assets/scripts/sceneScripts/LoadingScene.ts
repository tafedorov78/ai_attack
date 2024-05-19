// assets/scripts/LoadingScene.ts
import { _decorator, Component } from 'cc';
import { SceneManager } from './SceneManager';
const { ccclass, property } = _decorator;

@ccclass('LoadingScene')
export class LoadingScene extends Component {
    onLoad() {
        this.scheduleOnce(this.loadNextScene, 0.5);
    }

    loadNextScene() {
        SceneManager.instance.loadScene('LobbyScene');
    }
}
