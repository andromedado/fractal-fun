'use strict';

const c = document.getElementById('fractal-thing');
const ctx = c.getContext('2d');

const width = c.offsetWidth;
const height = c.offsetHeight;
const padding = 10;
const length = 300;
const shapes = [];

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
/* */

let altSquare = new Square(new Point(padding * 2 + length, padding * 2 + length), length);
altSquare.getFractalIteration = Shape.prototype.getFractalIteration;
altSquare.calculateProportion = function () {
    return 1 - 1 / Math.sqrt(5);
};
shapes.push(altSquare);

let serpinskiCarpet = new Square(new Point(padding * 3 + length * 2, padding * 2 + length), length);
shapes.push(serpinskiCarpet);

let triangle = new EquilateralTriangle(new Point(padding + length / 2, padding * 2 + length), length)
shapes.push(triangle);

/* */
shapes.forEach((shape) => {
    shape.draw(ctx);
    shape.fractify(ctx);
});

/* */


console.log(`App loaded ${new Date()}`);