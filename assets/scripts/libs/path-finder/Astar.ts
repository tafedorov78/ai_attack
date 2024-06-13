export type PathPoint = {
    i: number;  // Индекс строки (вертикальный)
    j: number;  // Индекс столбца (горизонтальный)
    cost: number;
    heuristic: number;
    total: number;
    parent?: PathPoint;
};

export function aStar(grid: number[][], 
    startPoint: PathPoint, 
    endPoint: PathPoint, 
    blockCodes: Set<number>,
    dynamicObjects?: Map<number, PathPoint>,
): PathPoint[] | null {
    // Создаем чистые множества и массивы для каждого вызова функции
    const openSet: PathPoint[] = [startPoint];
    const closedSet: Set<string> = new Set();
    const createKey = (p: PathPoint) => `${p.i},${p.j}`;

    // Инициализация начальной точки
    startPoint.cost = 0;
    startPoint.heuristic = Math.abs(startPoint.i - endPoint.i) + Math.abs(startPoint.j - endPoint.j);
    startPoint.total = startPoint.cost + startPoint.heuristic;

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.total - b.total);
        let current = openSet.shift()!;
        
        if (current.i === endPoint.i && current.j === endPoint.j) {
            return reconstructPath(current);
        }

        closedSet.add(createKey(current));

        getNeighbors(grid, current, endPoint, blockCodes, dynamicObjects).forEach(neighbor => {
            if (closedSet.has(createKey(neighbor))) return;

            const tentativeCost = current.cost + ((neighbor.i !== current.i && neighbor.j !== current.j) ? 1.414 : 1); // Стоимость диагонального перемещения √2 (приблизительно 1.414)
            let inOpenSet = openSet.find(p => createKey(p) === createKey(neighbor));

            if (!inOpenSet) {
                neighbor.parent = current;
                neighbor.cost = tentativeCost;
                neighbor.total = neighbor.cost + neighbor.heuristic;
                openSet.push(neighbor);
            } else if (tentativeCost < inOpenSet.cost) {
                inOpenSet.parent = current;
                inOpenSet.cost = tentativeCost;
                inOpenSet.total = tentativeCost + inOpenSet.heuristic;
            }
        });
    }

    return null;
}

function getNeighbors(grid: number[][], node: PathPoint, goal: PathPoint, blockedCodes: Set<number>, dynamicObjects?: Map<number, PathPoint>): PathPoint[] {
    const neighbors: PathPoint[] = [];
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0], // вправо, вниз, влево, вверх
        [1, 1], [1, -1], [-1, -1], [-1, 1] // диагональные направления
    ];

    const createKey = (p: PathPoint) => `${p.i},${p.j}`;
    const dynamicObjectKeys = dynamicObjects ? new Set(Array.from(dynamicObjects.values()).map(p => createKey(p))) : new Set();

    directions.forEach(([di, dj]) => {
        const i = node.i + di;
        const j = node.j + dj;

        if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && 
            !blockedCodes.has(grid[i][j]) && 
            !dynamicObjectKeys.has(createKey({i, j, cost: 0, heuristic: 0, total: 0}))) {

            // Для диагональных перемещений убеждаемся, что оба соседних горизонтальных и вертикальных клетки также проходимы
            if ((di === 1 || di === -1) && (dj === 1 || dj === -1)) {
                const isHorizontalClear = !blockedCodes.has(grid[node.i][node.j + dj]) && !dynamicObjectKeys.has(createKey({i: node.i, j: node.j + dj, cost: 0, heuristic: 0, total: 0}));
                const isVerticalClear = !blockedCodes.has(grid[node.i + di][node.j]) && !dynamicObjectKeys.has(createKey({i: node.i + di, j: node.j, cost: 0, heuristic: 0, total: 0}));
                if (!isHorizontalClear || !isVerticalClear) {
                    return;
                }
            }
            neighbors.push({
                i: i,
                j: j,
                cost: node.cost,
                heuristic: Math.abs(i - goal.i) + Math.abs(j - goal.j),
                total: 0
            });
        }
    });

    return neighbors;
}

function reconstructPath(current: PathPoint): PathPoint[] {
    let path: PathPoint[] = [];
    while (current) {
        path.push(current);
        current = current.parent!;
    }
    return path.reverse();
}

