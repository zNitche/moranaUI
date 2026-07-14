export default interface DragDetail {
    positionDiff: {
        x: number;
        y: number;
    };
    distanceFromStart: number;
    angleDiff: number;
}
