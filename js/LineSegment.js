
function LineSegment(pointA, pointB) {
    this.pointA = pointA;
    this.pointB = pointB;
    Shape.call(this, 2, [pointA, pointB]);
}

LineSegment.prototype = new Shape();

function counterClockwiseOrder (pointA, pointB, pointC) {
    return ((pointC.y - pointA.y) * (pointB.x - pointA.x)) > ((pointB.y - pointA.y) * (pointC.x - pointA.x));
}

LineSegment.prototype.getSideSegments = function() {
    return [this];
};

LineSegment.prototype.intersectsWith = function (otherSegment) {
    const thisBox = new BoundingBox(this);
    const otherBox = new BoundingBox(otherSegment);
    if (thisBox.minX > otherBox.maxX ||
        thisBox.minY > otherBox.maxY ||
        thisBox.maxX < otherBox.minX ||
        thisBox.maxY < otherBox.minY) {
        return false;
    }
    //Ok, our bounding boxes overlap
    return counterClockwiseOrder(this.pointA, otherSegment.pointA, otherSegment.pointB) !== counterClockwiseOrder(this.pointB, otherSegment.pointA, otherSegment.pointB) &&
        //ccw(A,B,C) != ccw(A,B,D)
        counterClockwiseOrder(this.pointA, this.pointB, otherSegment.pointA) !== counterClockwiseOrder(this.pointA, this.pointB, otherSegment.pointB);
};

LineSegment.prototype.length = function () {
    return this.pointA.distance(this.pointB);
};

