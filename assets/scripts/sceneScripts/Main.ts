// assets/scripts/Main.ts
import { _decorator, Component } from 'cc';
import { SceneManager } from './SceneManager';
const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    start() {
        // begin scene
        SceneManager.instance.loadScene('LoadingScene');
    }
}
