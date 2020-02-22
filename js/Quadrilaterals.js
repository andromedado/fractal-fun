
function Quadrilateral(points) {
    Shape.call(this, 4);
    this.points = points;
}
Quadrilateral.prototype = new Shape();


function Square(topLeftPoint, sideLength) {
    const points = [topLeftPoint];
    points.push(new Point(topLeftPoint.x + sideLength, topLeftPoint.y));
    points.push(new Point(topLeftPoint.x + sideLength, topLeftPoint.y + sideLength));
    points.push(new Point(topLeftPoint.x, topLeftPoint.y + sideLength));
    Quadrilateral.call(this, points);
}
Square.prototype = new Quadrilateral();

