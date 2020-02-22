
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

/*
EquilateralTriangle.prototype.getCenter = function () {
    const tHeight = Math.sin(degToRad(60)) * this.sidesLength;
    const yHeight = (Math.tan(degToRad(30)) * this.sidesLength) / 2;
    const y = this.topmostPoint.y + tHeight - yHeight;
    return new Point(this.topmostPoint.x, y);
};
*/

EquilateralTriangle.prototype.generatePoints = function () {
    const rightPoint = new Point(topmostPoint.x + this.sidesLength / 2, topmostPoint.y + Math.sin(degToRad(60)) * this.sidesLength);
    const leftPoint = new Point(topmostPoint.x - this.sidesLength / 2, topmostPoint.y + Math.sin(degToRad(60)) * this.sidesLength)
    this.points = [topmostPoint, rightPoint, leftPoint];
    return this.points;
}
