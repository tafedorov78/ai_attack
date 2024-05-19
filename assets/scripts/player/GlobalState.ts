import { PathPoint } from "scripts/pathFinder/Astar";

export class GlobalState {
    static playerPositions: Map<number, PathPoint> = new Map();
    static blockers: Set<number> = new Set<number>();
}
