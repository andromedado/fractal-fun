'use strict';

const c = document.getElementById('fractal-thing');
const ctx = c.getContext('2d');

const width = c.offsetWidth;
const height = c.offsetHeight;
const padding = 10;
const length = 300;
const shapes = [];

let plaidSquare = new Square(new Point(padding, padding), length);
plaidSquare.calculateProportion = function() {
    return 1 / Math.sqrt(this.sides + 1);
};
shapes.push(plaidSquare);

let altSquare = new Square(new Point(padding * 2 + length, padding), length);
altSquare.calculateProportion = function () {
    return 0.51;
};
shapes.push(altSquare);

let triangle = new EquilateralTriangle(new Point(padding + length / 2, padding * 2 + length), length)
shapes.push(triangle);

shapes.forEach((shape) => {
    shape.draw(ctx);
    shape.fractify(ctx);
});

/* */


console.log(`App loaded ${new Date()}`);