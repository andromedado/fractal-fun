'use strict';

const c = document.getElementById('fractal-thing');
const ctx = c.getContext('2d');

const width = c.offsetWidth;
const height = c.offsetHeight;
const padding = width / 10;

const topmostPoint = new Point(width / 2, padding);
let triangle = new EquilateralTriangle(topmostPoint, width - padding * 2);
triangle.draw(ctx);
triangle.fractify(ctx);


//shape = new Triangle([new Point(padding, padding), new Point(width - padding, height / 3), new Point(width / 3, height -padding)]);
let square = new Square(new Point(padding, padding), width - padding * 2);

square.draw(ctx);
square.fractify(ctx);

/* */


console.log(`App loaded ${new Date()}`);