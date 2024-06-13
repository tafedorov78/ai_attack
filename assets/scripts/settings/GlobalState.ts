import { PathPoint } from "scripts/libs/path-finder/Astar";

export class GlobalState {
    static Grid: number[][];
    static playerPositions: Map<number, PathPoint> = new Map();
    static blockers: Set<number> = new Set<number>();
}
