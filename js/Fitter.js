

const UP = 'up';
const DOWN = 'down';

function Fitter(initialValue) {
    this.initialValue = initialValue || 0.5;
    this.setValue(this.initialValue);
}

Fitter.prototype.maxDigits = 15;
Fitter.prototype.allowGreaterThanOne = false;

Fitter.prototype.setValue = function (val) {
    this.value = val;
    this.stringValue = val + '';
    if (!(/\./.test(this.stringValue))) {
        this.stringValue = `${this.stringValue}.0`;
    }
    const indexOfDot = this.stringValue.indexOf('.');
    let consecutiveZeroes = 0;
    for (let i = indexOfDot + 1; i < indexOfDot + this.maxDigits; i++) {
        let digit = this.stringValue[i];
        if (digit === void 0 || digit === '0') {
            consecutiveZeroes += 1;
            if (consecutiveZeroes >= 3) {
                this.digits = i - 3 - indexOfDot;
                break;
            }
        } else {
            this.digits = i - indexOfDot;
        }
    }
    if (this.digit === void 0) {
        this.digit = this.digits + 1;
    }
};

Fitter.prototype.getDigit = function (digit) {
    return Math.floor(Math.pow(10, digit) * this.value) % 10;
};


Fitter.prototype.plus = function () {
    if (this.direction === DOWN) {
        //changing direction
        this.digit = this.digit + 1;
    }
    this.direction = UP;
    this.setValue(this.value + Math.pow(10, -1 * this.digit));
    return this.digit < this.maxDigits;
};

Fitter.prototype.minus = function () {
    if (this.direction === UP) {
        //changing direction
        this.digit = this.digit + 1;
    }
    this.direction = DOWN;
    this.setValue(this.value - Math.pow(10, -1 * this.digit));
    return this.digit < this.maxDigits;
};

Fitter.prototype.fitTo = function (compareFn, maxIterations) {
    let i = 0;
    maxIterations = maxIterations || 10000;
    while (i++ < maxIterations) {
        let comparisonResult = compareFn(this.value);
        if (comparisonResult === 0) {
            break;
        }
        let opResult;
        if (comparisonResult > 0) {
            opResult = this.minus();
        } else {
            opResult = this.plus();
        }
        if (opResult === false) {
            break;
        }
    }
    return this.value;
};

