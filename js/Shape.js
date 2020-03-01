'use strict';

function Shape(numSides) {
    const args = [].slice.call(arguments);
    this.numSides = args.shift();
    args.forEach((arg) => {
        if (arg instanceof Point) {
            this.initialPoint = arg;
        } else if (arg && arg.length) {
            this.setPoints(arg);
        } else if (arg && arg > 0) {
            this.sideLength = arg;
        }
    });
    if (this.sideLength && !this.points && this.initialPoint) {
        this.generatePoints();
    }
    if (!this.sideLength && this.points && this.points.length > 1) {
        let length;
        this.getSideSegments().forEach(line => {
            const l = line.length();
            if (length === void 0) {
                length = l;
            } else if (!floatsEqual(length, l)) {
                length = false;
            }
        });
        if (length) {
            this.sideLength = length;
        }
    }
}

Shape.prototype.initialPoint = Point.origin();

Shape.prototype.getPoints = function () {
    return this.points;
};

Shape.prototype.getSideSegments = function () {
    if (!this.sideSegments) {
        this.sideSegments = [];
        for (let i = 0; i < this.numSides; i++) {
            const a = this.points[i];
            const b = this.points[(i + 1) % this.points.length];
            this.sideSegments.push(new LineSegment(a, b));
        }
    }
    return this.sideSegments;
};

Shape.prototype.intersectsWith = function (otherShape) {
    const mySides = this.getSideSegments();
    const theirSides = otherShape.getSideSegments();
    for (let i = 0; i < mySides.length; i++) {
        for(let j = 0; j < theirSides.length; j++) {
            if (mySides[i].intersectsWith(theirSides[j])) {
                return true;
            }
        }
    }
    return false;
};

Shape.prototype.generatePoints = function () {
    const points = [this.initialPoint];

    const angleSum = 180 * (this.numSides - 2);
    const vertexAngle = angleSum / this.numSides * -1;
    let lastPoint = points[0];
    for (let i = 1; i < this.numSides; i++) {
        let nextPoint = lastPoint.radialPoint(this.sideLength, i * (180 - vertexAngle));
        points.push(nextPoint);
        lastPoint = nextPoint;
    }
    this.setPoints(points);
    return this.points;
};

Shape.prototype.setPoints = function (points) {
    this.points = points;
};

Shape.prototype.getAnchorPoint = function () {
    if (!this.anchorPoint) {
        this.anchorPoint = (new BoundingBox(this)).anchorPoint;
    }
    return this.anchorPoint;
};

Shape.prototype.setAnchorPoint = function (anchorPoint) {
    let myPoint = this.getAnchorPoint();
    let xD = anchorPoint.x - myPoint.x;
    let yD = anchorPoint.y - myPoint.y;
    this.points = this.points.map(p => {
        return new Point(p.x + xD, p.y + yD);
    });
    this.anchorPoint = anchorPoint;
};

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
    if (this.boldPoints) {
        let size = 2;
        this.points.forEach((point) => {
            ctx.dot(point, size);
            if (this.numberedPoints) {
                size++;
            }
        });
    }
};

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
    return 0.55;
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
    this.i = 0;
    return () => {
        let point = this.getPointsForFractify().rand();
        const resultPoint = lastPoint.proportionateJump(point, this.calculateProportion());
        ctx.dot(resultPoint);
        lastPoint = resultPoint;
        this.i++;
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
        if (this.i > Math.pow(10, 5)) {
            this.stopFractal();
        }
    }, 1);
    return this.fractalInterval;
};

Shape.prototype.stopFractal = function () {
    if (this.fractalInterval) {
        clearInterval(this.fractalInterval);
        this.fractalInterval = null;
        console.log(`Stopping ${this}`);
    }
};




