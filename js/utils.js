'use strict';

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

function rand(min, max) {
    const diff = max - min;
    return Math.random() * diff + min;
}

function floatsEqual (a, b, tolerance) {
    if (!tolerance) {
        tolerance = 0.001;
    }
    return Math.abs(a - b) < tolerance;
}

Array.prototype.rand = function () {
    const i = Math.floor(Math.random() * this.length);
    return this[i];
};

CanvasRenderingContext2D.prototype.dot = function dot (point, size) {
    ctx.beginPath();
    ctx.fillStyle = '#000';
    ctx.arc(point.x, point.y, size || 0.1, degToRad(0), degToRad(360), false);
    ctx.fill();
};

CanvasRenderingContext2D.prototype.moveToPoint = function (point) {
    return this.moveTo(point.x, point.y);
};

CanvasRenderingContext2D.prototype.lineToPoint = function (point) {
    return this.lineTo(point.x, point.y);
};



