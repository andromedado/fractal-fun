'use strict';

const c = document.getElementById('fractal-thing');
const ctx = c.getContext('2d');

const width = c.offsetWidth;
const height = c.offsetHeight;
const padding = 10;
const length = 700;
const shapes = [];

for (let i = 3; i < 14; i++) {
    shapes.push(new Shape(i, length / i));
}
shapes.push(new Square(Point.origin(), length / 4));

const table = new ShapeTable(shapes);
table.setAnchorPoint(new Point(padding, padding));
table.setNumColumns(4);

table.draw(ctx);

/*
let smaller = shapes[2].clone();
smaller.scaleTo(0.4);
smaller.alignPointTo(1, shapes[2].points[1]);
let otherSmall = smaller.clone();
otherSmall.alignPointTo(0, shapes[2].points[0]);

smaller.draw(ctx);
otherSmall.draw(ctx);
/**/

shapes.forEach(s => {
    s.fractify(ctx);
});

// shapes.push(new Shape(5, length));
// shapes.push(new Shape(6, length));
// shapes.push(new Shape(7, length));

/*

let plaidSquare = new Square(new Point(padding, padding), length);
plaidSquare.getFractalIteration = Shape.prototype.getFractalIteration;
plaidSquare.calculateProportion = function() {
    return 1 / Math.sqrt(5);
};
shapes.push(plaidSquare);

//* * /
let subSquares = new Square(new Point(padding * 3 + length * 2, padding), length);
subSquares.getFractalIteration = Shape.prototype.getFractalIteration;
subSquares.calculateProportion = function () {
    return 0.50;
};
shapes.push(subSquares);

subSquares.useCorners = false;
subSquares.allPoints = true;
subSquares.draw(ctx);
subSquares.fractify(ctx);


let test = new Square(new Point(padding * 2 + length, padding), length);
test.getFractalIteration = Shape.prototype.getFractalIteration;
test.calculateProportion = function () {
    return 0.49;
};
shapes.push(test);
//* * /

let altSquare = new Square(new Point(padding * 2 + length, padding * 2 + length), length);
altSquare.getFractalIteration = Shape.prototype.getFractalIteration;
altSquare.calculateProportion = function () {
    return 1 - 1 / Math.sqrt(5);
};
shapes.push(altSquare);

let serpinskiCarpet = new Square(new Point(padding * 3 + length * 2, padding * 2 + length), length);
shapes.push(serpinskiCarpet);


/* * /
shapes.forEach((shape) => {
    shape.draw(ctx);
    shape.fractify(ctx);
});

/* */


console.log(`App loaded ${new Date()}`);