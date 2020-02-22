'use strict';

const c = document.getElementById('fractal-thing');
const ctx = c.getContext('2d');

const width = c.offsetWidth;
const height = c.offsetHeight;
const padding = 10;

/*
const topmostPoint = new Point(width / 2, padding);
let triangle = new EquilateralTriangle(topmostPoint, width - padding * 2);
triangle.draw(ctx);
triangle.fractify(ctx);
/* */

//shape = new Triangle([new Point(padding, padding), new Point(width - padding, height / 3), new Point(width / 3, height -padding)]);

//*

const length = 300;

let plaidSquare = new Square(new Point(padding, padding), length);
plaidSquare.calculateProportion = function() {
    return 1 / Math.sqrt(this.sides + 1);
};

plaidSquare.draw(ctx);
plaidSquare.fractify(ctx);

let triangle = new EquilateralTriangle(new Point(padding + length / 2, padding * 2 + length), length)
triangle.draw(ctx);
triangle.fractify(ctx);

/* */


console.log(`App loaded ${new Date()}`);