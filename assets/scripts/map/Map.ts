import { Component, TiledMap, _decorator } from 'cc';
import Facade from 'scripts/Facade';
import { GlobalState } from 'scripts/player/GlobalState';

const { ccclass, property } = _decorator;


export function addBlocker(code: number): void {
    GlobalState.blockers.add(code);
}

@ccclass('Map')
export class Map extends Component {

    tileMap: TiledMap;
    arr: number[][];

    protected onLoad(): void {
        this.tileMap = this.node.getComponent(TiledMap);
       Facade.Grid = this.flipArrayVertically(this.parseMapFromXml(this.tileMap._tmxFile.tmxXmlStr));

       console.log(Facade.Grid);
    }

   parseMapFromXml(xmlData: string): number[][] {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlData, 'application/xml');

        const xpathEvaluator = new XPathEvaluator();
        const result = xpathEvaluator.evaluate('//layer/data', doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        const dataNode = result.singleNodeValue;
        
        if (!dataNode || !dataNode.textContent) {
            console.error('Элемент <data> не найден или пуст');
            return [];
        }

        const dataCsv = dataNode.textContent.trim();
        const dataRows = dataCsv.split('\n').map(row => row.split(',').map(Number));
        return dataRows;
    }

    flipArrayVertically(matrix: number[][]): number[][] {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    const flippedMatrix: number[][] = new Array(numRows).fill(null).map(() => new Array(numCols).fill(0));

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            flippedMatrix[numRows - 1 - i][j] = matrix[i][j];
        }
    }

    return flippedMatrix;  
}

}