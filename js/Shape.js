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

Shape.prototype.useCorners = true;
Shape.prototype.initialPoint = Point.origin();

Shape.prototype.toString = function () {
    let shape;
    switch (this.points.length) {
        case 2:
            shape = 'LineSegment';
            break;
        case 3:
            shape = 'Triangle';
            break;
        case 4:
            shape = 'Quadrilateral';
            break;
        case 5:
            shape = 'Pentagon';
            break;
        case 6:
            shape = 'Hexagon';
            break;
        case 7:
            shape = 'Heptagon';
            break;
        case 8:
            shape = 'Octagon';
            break;
        case 9:
            shape = 'Nonagon';
            break;
        case 10:
            shape = 'Decagon';
            break;
        case 11:
            shape = 'Hendecagon';
            break;
        case 12:
            shape = 'Dodecagon';
            break;
        default:
            shape = `Polygon(${this.points.length})`;
    }
    if (this.sideLength) {
        shape = `${shape}<${this.sideLength.toFixed(1)}>`;
    }
    return shape;
};

Shape.prototype.clone = function () {
    return new Shape(this.numSides, this.points);
};

Shape.prototype.getPoints = function () {
    return this.points;
};

Shape.prototype._clearCache = function () {
    this.sideSegments = void 0;
    this.anchorPoint = void 0;
    this.sidePoints = void 0;
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

Shape.prototype.scaleTo = function (proportion) {
    let anchorPoint = this.getAnchorPoint();
    this.points = this.points.map((point) => {
        return new Point(point.x * proportion, point.y * proportion);
    });
    this._clearCache();
    this.setAnchorPoint(anchorPoint);
};

Shape.prototype.translate = function (xD, yD) {
    this.points = this.points.map((p) => p.translate(xD, yD));
    this._clearCache();
};

Shape.prototype.alignPointTo = function (myPointIndex, otherPoint) {
    if (myPointIndex >= this.points.length) {
        throw new Error(`Bad point index: ${myPointIndex}`);
    }
    const myPoint = this.points[myPointIndex];
    const [xD, yD] = myPoint.delta(otherPoint);
    this.translate(xD, yD);
};

Shape.prototype.setAnchorPoint = function (anchorPoint) {
    let myPoint = this.getAnchorPoint();
    let xD = anchorPoint.x - myPoint.x;
    let yD = anchorPoint.y - myPoint.y;
    this.points = this.points.map(p => {
        return new Point(p.x + xD, p.y + yD);
    });
    this._clearCache();
    this.anchorPoint = anchorPoint;
};

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

Shape.prototype.calculateProportion = function (ctx) {
    switch(this.points.length) {
        case 4:
            return 0.51;//Special Case
        /*
        case 3:
            return 0.5;
        case 5:
            return 1 - 1 / (1 + ((1 + Math.pow(5, 0.5)) / 2));
        case 6:
            return 2/3;
            */
        default:
            if (!this._proportion) {
                const fitter = new Fitter(0.5);
                fitter.fitTo((proportion) => {
                    this.miniOne = this.clone();
                    this.miniTwo = this.clone();
                    this.miniOne.scaleTo(proportion);
                    this.miniOne.alignPointTo(0, this.points[0]);
                    this.miniTwo.scaleTo(proportion);
                    this.miniTwo.alignPointTo(1, this.points[1]);
                    if (ctx) {
                        this.miniOne.draw(ctx);
                        this.miniTwo.draw(ctx);
                    }
                    if (this.miniOne.intersectsWith(this.miniTwo)) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
                this._proportion = 1 - fitter.value;
                console.log(`${this} has a fractal proportion of ${fitter.value}`);
                // const x = this.points.length - 3;
                // const mx = 0.25;
                // this._proportion = 0.5 + ((-1 * Math.pow(4 * x + (1/mx), -1)) + mx);
            }
            return this._proportion;
    }
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

Shape.prototype.fractify = function (ctx, limit) {
    if (this.fractalInterval) {
        return this.fractalInterval;
    }
    limit = limit || Math.pow(10, 5);
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
        if (this.i > limit) {
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




