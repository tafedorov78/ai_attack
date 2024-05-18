import { Component, TiledMap, _decorator } from 'cc';
import Facade from './Facade';

const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {

    @property({type: TiledMap})
    private tilemap: TiledMap;

    arr: number[][];

    protected onLoad(): void {
       Facade.Grid = this.parseMapFromXml(this.tilemap._tmxFile.tmxXmlStr);
       console.log(Facade.Grid);
       
    }

   parseMapFromXml(xmlData: string): number[][] {
        // Создаем документ из строки XML
        const parser = new DOMParser();
        const doc = parser.parseFromString(xmlData, 'application/xml');

        // Создаем XPathEvaluator для выполнения XPath запросов
        const xpathEvaluator = new XPathEvaluator();
        const result = xpathEvaluator.evaluate('//layer/data', doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);

        const dataNode = result.singleNodeValue;
        
        if (!dataNode || !dataNode.textContent) {
            console.error('Элемент <data> не найден или пуст');
            return [];
        }

        // Получаем текстовое содержимое элемента <data>
        const dataCsv = dataNode.textContent.trim();
        // Разбиваем CSV строку на строки, затем на числа
        const dataRows = dataCsv.split('\n').map(row => row.split(',').map(Number));
        return dataRows;
    }

    mirrorArray(matrix: number[][]): number[][] {
    const numRows = matrix.length;
    const numCols = matrix[0].length;

    const mirroredMatrix: number[][] = new Array(numRows).fill(null).map(() => new Array(numCols).fill(0));

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            mirroredMatrix[numRows - 1 - i][numCols - 1 - j] = matrix[i][j];
        }
    }

    return mirroredMatrix;
}

}