'use strict';

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function rand(min, max) {
    const diff = max - min;
    return Math.random() * diff + min;
}

Array.prototype.rand = function () {
    const i = Math.floor(Math.random() * this.length);
    return this[i];
};

function Point (x, y) {
    this.x = Math.round(x * 100)/100;
    this.y = Math.round(y * 100)/100;
}

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

CanvasRenderingContext2D.prototype.dot = function dot (point) {
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(point.x, point.y, 0.25, degToRad(0), degToRad(360), false);
    ctx.fill();
};

CanvasRenderingContext2D.prototype.moveToPoint = function (point) {
    return this.moveTo(point.x, point.y);
};

CanvasRenderingContext2D.prototype.lineToPoint = function (point) {
    return this.lineTo(point.x, point.y);
};



