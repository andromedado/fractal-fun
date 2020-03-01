
function Quadrilateral(points) {
    Shape.call(this, 4, points);
}
Quadrilateral.prototype = new Shape();
Quadrilateral.prototype.sides = 4;

function BoundingBox(/* Shape[, Shape] | corners*/) {
    const args = [].slice.call(arguments);
    let points = [];
    args.forEach((arg) => {
        [].concat(arg).forEach((ar) => {
            if (!ar.getPoints) {
                console.error(ar);
            }
            points = points.concat(ar.getPoints());
        });
    });
    this.minX = Point.minX(points);
    this.minY = Point.minY(points);
    this.maxX = Point.maxX(points);
    this.maxY = Point.maxY(points);
    this.width = this.maxX - this.minX;
    this.height = this.maxY - this.minY;
    Quadrilateral.call(this, [
        new Point(this.minX, this.minY),
        new Point(this.maxX, this.minY),
        new Point(this.maxX, this.maxY),
        new Point(this.minX, this.maxY),
    ]);
    this.anchorPoint = this.points[0];
}
BoundingBox.prototype = new Quadrilateral();

function Square(topLeftPoint, sideLength) {
    this.sideLength = sideLength;
    this.initialPoint = topLeftPoint;
    this.generatePoints();
    Quadrilateral.call(this, this.points);
}
Square.prototype = new Quadrilateral();

Square.prototype.getFractalGrid = function () {
    if (!this.fractalGrid) {
        this.fractalGrid = [];
        const gridSideLength = this.sideLength / 3;
        for(let x = 0; x < 3; x++) {
            for(let y = 0; y < 3; y++) {
                if (x === 1 && y === 1) continue;
                const tX = this.points[0].x - x * gridSideLength;
                const tY = this.points[0].y - y * gridSideLength;
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

