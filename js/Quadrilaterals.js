
function Quadrilateral(points) {
    Shape.call(this, 4);
    this.points = points;
}
Quadrilateral.prototype = new Shape();

function Square(topLeftPoint, sideLength) {
    this.sideLength = sideLength;
    const points = [topLeftPoint];
    points.push(new Point(topLeftPoint.x + sideLength, topLeftPoint.y));
    points.push(new Point(topLeftPoint.x + sideLength, topLeftPoint.y + sideLength));
    points.push(new Point(topLeftPoint.x, topLeftPoint.y + sideLength));
    Quadrilateral.call(this, points);
}
Square.prototype = new Quadrilateral();

Square.prototype.getFractalGrid = function () {
    if (!this.fractalGrid) {
        this.fractalGrid = [];
        const gridSideLength = this.sideLength / 3;
        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                if (x === 1 && y === 1) continue;
                const tX = x * gridSideLength + this.points[0].x;
                const tY = y * gridSideLength + this.points[0].y;
                this.fractalGrid.push(new Square(new Point(tX, tY), gridSideLength));
            }
        }
    }
    return this.fractalGrid;
};

Square.prototype.scalePoint = function (point, intoSquare) {
    const basePoint = this.points[0];
    const ratio = intoSquare.sideLength / this.sideLength;

    const xDiff = (basePoint.x - point.x) * ratio;
    const xResult = intoSquare.points[0].x - xDiff;

    const yDiff = (basePoint.y - point.y) * ratio;
    const yResult = intoSquare.points[0].y - yDiff;

    return new Point(xResult, yResult);
};

Square.prototype.getFractalIteration = function () {
    let lastPoint = this.getCenter();
    return () => {
        let iterationSquare = this.getFractalGrid().rand();
        const resultPoint = this.scalePoint(lastPoint, iterationSquare);
        ctx.dot(resultPoint);
        lastPoint = resultPoint;
    };
};

