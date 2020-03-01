'use strict';

function Point (x, y) {
    this.x = Math.round(x * 100)/100;
    this.y = Math.round(y * 100)/100;
}

Point.origin = function () {
    return new Point(0, 0);
};

Point.minX = function (points) {
    if (points.getPoints) {
        points = points.getPoints();
    }
    if (points.length && !points[0]) {
        debugger;
    }
    return Math.min.apply(Math, points.map(p => p.x));
};

Point.minY = function (points) {
    if (points.getPoints) {
        points = points.getPoints();
    }
    return Math.min.apply(Math, points.map(p => p.y));
};

Point.maxX = function (points) {
    if (points.getPoints) {
        points = points.getPoints();
    }
    return Math.max.apply(Math, points.map(p => p.x));
};

Point.maxY = function (points) {
    if (points.getPoints) {
        points = points.getPoints();
    }
    return Math.max.apply(Math, points.map(p => p.y));
};

//Can act like a shape
Point.prototype.getPoints = function () {
    return [this];
};

Point.prototype.averageWith = function (otherPoint) {
    return this.proportionateJump(otherPoint, 1/2);
};

Point.prototype.proportionateJump = function (otherPoint, proportion) {
    const diffX = this.x - otherPoint.x;
    const x = this.x - diffX * proportion;
    const diffY = this.y - otherPoint.y;
    const y = this.y - diffY * proportion;
    return new Point(x, y);
};

Point.prototype.toString = function () {
    return `Point(${this.x}, ${this.y})`;
};

Point.prototype.clone = function () {
    return new Point(this.x, this.y);
};

Point.prototype.distance = function (otherPoint) {
    const xDelta = otherPoint.x - this.x;
    const yDelta = otherPoint.y - this.y;
    return Math.sqrt(Math.pow(xDelta, 2) + Math.pow(yDelta, 2));
};

Point.prototype.translate = function (xD, yD) {
    return new Point(this.x + xD, this.y + yD);
};

Point.prototype.delta = function (otherPoint) {
    return [otherPoint.x - this.x, otherPoint.y - this.y];
};

Point.prototype.radialPoint = function (distance, theta) {
    while (theta < 0) theta += 360;
    theta = theta % 360;
    const xDelta = Math.cos(degToRad(theta)) * distance;
    const yDelta = Math.sin(degToRad(theta)) * distance;
    return new Point(this.x + xDelta, this.y + yDelta);

};

