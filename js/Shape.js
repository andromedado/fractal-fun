'use strict';

function Shape(sides) {
    this.sides = sides || 3;
}

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

Shape.prototype.fractify = function (ctx) {
    if (this.fractalInterval) {
        return this.fractalInterval;
    }
    const self = this;

    let lastPoint = this.getCenter();
    function thunk() {
        let point = self.points.rand();
        const resultPoint = lastPoint.proportionateJump(point, 1/(self.sides - 1));
        ctx.dot(resultPoint);
        lastPoint = resultPoint;
    }

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
    /* */
};

Shape.prototype.stopFractal = function () {
    if (this.fractalInterval) {
        clearInterval(this.fractalInterval);
        this.fractalInterval = null;
    }
};


