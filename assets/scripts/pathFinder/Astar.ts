export type PathPoint = {
    i: number;  // Row index (vertical)
    j: number;  // Column index (horizontal)
    cost: number;
    heuristic: number;
    total: number;
    parent?: PathPoint;
};

export function aStar(grid: number[][], start: PathPoint, goal: PathPoint, blockedCodes: Set<number>): PathPoint[] | null {
    const openSet: PathPoint[] = [start];
    const closedSet: Set<string> = new Set();
    const createKey = (p: PathPoint) => `${p.i},${p.j}`;

    start.total = start.heuristic;

    while (openSet.length > 0) {
        openSet.sort((a, b) => a.total - b.total);
        let current = openSet.shift()!;
        
        if (current.i === goal.i && current.j === goal.j) {
            return reconstructPath(current);
        }

        closedSet.add(createKey(current));

        getNeighbors(grid, current, goal, blockedCodes).forEach(neighbor => {
            if (closedSet.has(createKey(neighbor))) return;

            const tentativeCost = current.cost + ((neighbor.i !== current.i && neighbor.j !== current.j) ? 1.414 : 1); // Diagonal move cost is √2 (approximated as 1.414)
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

function getNeighbors(grid: number[][], node: PathPoint, goal: PathPoint, blockedCodes: Set<number>): PathPoint[] {
    const neighbors: PathPoint[] = [];
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0], // right, down, left, up
        [1, 1], [1, -1], [-1, -1], [-1, 1] // diagonal directions
    ];

    directions.forEach(([di, dj]) => {
        const i = node.i + di;
        const j = node.j + dj;

        if (i >= 0 && i < grid.length && j >= 0 && j < grid[i].length && !blockedCodes.has(grid[i][j])) {
            // For diagonal moves, ensure that both adjacent horizontal and vertical cells are also walkable
            if ((di === 1 || di === -1) && (dj === 1 || dj === -1)) {
                const isHorizontalClear = !blockedCodes.has(grid[node.i][node.j + dj]);
                const isVerticalClear = !blockedCodes.has(grid[node.i + di][node.j]);
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