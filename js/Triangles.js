
function Triangle(points) {
    Shape.call(this, 3);
    this.points = points;
}
Triangle.prototype = new Shape();

function EquilateralTriangle(topmostPoint, sidesLength) {
    this.topmostPoint = topmostPoint;
    this.sidesLength = sidesLength;
    Triangle.call(this, this.generatePoints());
}
EquilateralTriangle.prototype = new Triangle();

EquilateralTriangle.prototype.generatePoints = function () {
    const rightPoint = new Point(this.topmostPoint.x + this.sidesLength / 2, this.topmostPoint.y + Math.sin(degToRad(60)) * this.sidesLength);
    const leftPoint = new Point(this.topmostPoint.x - this.sidesLength / 2, this.topmostPoint.y + Math.sin(degToRad(60)) * this.sidesLength)
    this.points = [this.topmostPoint, rightPoint, leftPoint];
    return this.points;
}
