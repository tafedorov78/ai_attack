// assets/scripts/SceneManager.ts
import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SceneManager')
export class SceneManager extends Component {
    static instance: SceneManager;

    onLoad() {
        SceneManager.instance = this;
    }

     loadScene(sceneName: string, onLoaded?: () => void) {
        director.loadScene(sceneName, onLoaded);
    }
}
