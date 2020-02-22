'use strict';

function Shape(sides) {
    this.sides = sides || 3;
}

Shape.prototype.useCorners = true;

Shape.prototype.draw = function (ctx) {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.moveToPoint(this.points[0]);
    for (let i = 1; i < this.points.length; i++) {
        ctx.lineToPoint(this.points[i]);
    }
    ctx.lineToPoint(this.points[0]);
    ctx.stroke();
}

Shape.prototype.getCenter = function () {
    let x = 0;
    let y = 0;
    this.points.forEach((point) => {
        x += point.x;
        y += point.y;
    });
    return new Point(x / this.points.length, y / this.points.length);
};

Shape.prototype.calculateProportion = function () {
    return 1 / 2;
};

Shape.prototype.getPointsForFractify = function () {
    if (this.useCorners) {
        return this.points;
    }
    if (!this.sidePoints) {
        this.sidePoints = [];
        let lastPoint = this.points[0];
        for (let i = 1; i <= this.points.length; i++) {
            let point = this.points[i % this.points.length];
            this.sidePoints.push(lastPoint.averageWith(point));
            lastPoint = point;
        }
    }
    if (this.allPoints) {
        return this.points.concat(this.sidePoints);
    }
    return this.sidePoints;
};

Shape.prototype.getFractalIteration = function (ctx) {
    let lastPoint = this.getCenter();
    return () => {
        let point = this.getPointsForFractify().rand();
        const resultPoint = lastPoint.proportionateJump(point, this.calculateProportion());
        ctx.dot(resultPoint);
        lastPoint = resultPoint;
    };
};

Shape.prototype.fractify = function (ctx) {
    if (this.fractalInterval) {
        return this.fractalInterval;
    }
    const thunk = this.getFractalIteration(ctx);
    thunk();
    this.fractalInterval = setInterval(() => {
        thunk();
        thunk();
        thunk();
        thunk();
        thunk();
        thunk();
        thunk();
        thunk();
    }, 1);
    return this.fractalInterval;
};

Shape.prototype.stopFractal = function () {
    if (this.fractalInterval) {
        clearInterval(this.fractalInterval);
        this.fractalInterval = null;
    }
};


