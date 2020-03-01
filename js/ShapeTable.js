
function ShapeCell (/* rank, file | shape */) {
    const args = [].slice.call(arguments);
    if (args.length === 1) {
        this.setShape(args.shift());
    } else if (args.length >= 2) {
        this.setRankAndFile(args.shift(), args.shift());
        if (args.length) {
            this.setShape(args.shift());
        }
    }
}

ShapeCell.prototype.width = 0;
ShapeCell.prototype.height = 0;

ShapeCell.prototype.setShape = function (shape) {
    this.shape = shape;
};

ShapeCell.prototype.setRankAndFile = function (rank, file) {
    this.rank = rank;
    this.file = file;
};

ShapeCell.prototype.setY = function (y) {
    this.y = y;
    if (this.y !== void 0 && this.x !== void 0) {
        this.anchorPoint = new Point(this.x, this.y);
    }
};

ShapeCell.prototype.setX = function (x) {
    this.x = x;
    if (this.y !== void 0 && this.x !== void 0) {
        this.anchorPoint = new Point(this.x, this.y);
    }
};

function ShapeSpan (cells) {
    this.cells = cells;
    this.cells.forEach(cell => {
        if (cell.shape) {
            const box = new BoundingBox(cell.shape);
            this.maxWidth = Math.max(this.maxWidth, box.width);
            this.netWidth = this.netWidth + box.width;
            this.maxHeight = Math.max(this.maxHeight, box.height);
            this.netHeight = this.netHeight + box.height;
        }
    });
}

ShapeSpan.prototype.maxWidth = 0;
ShapeSpan.prototype.maxHeight = 0;
ShapeSpan.prototype.netHeight = 0;
ShapeSpan.prototype.netWidth = 0;

function ShapeTable (/* rows, columns | [shapes] */) {
    this.table = {};
    const args = [].slice.call(arguments);
    if (args[0] && args[0][0] instanceof Shape) {
        this.setShapes(args[0]);
    } else {
        this.setNumRows(args.shift());
        this.setNumColumns(args.shift());
    }
}

ShapeTable.prototype.numRows = 1;
ShapeTable.prototype.numColumns = 1;
ShapeTable.prototype.padding = 10;
ShapeTable.prototype.anchorPoint = Point.origin();

ShapeTable.prototype.setAnchorPoint = function (anchorPoint) {
    this.anchorPoint = anchorPoint;
    this.distributeShapes();
};

ShapeTable.prototype.setPadding = function (padding) {
    this.padding = padding;
};

ShapeTable.prototype.setShapes = function (shapes) {
    this.shapes = shapes;
    if (this.numRows * this.numColumns < shapes.length) {
        this.resize();
    } else {
        this.distributeShapes();
    }
};

ShapeTable.prototype.resize = function () {
    const side = Math.ceil(Math.sqrt(shapes.length));
    this.setNumColumns(side);
    this.setNumRows(side);
    this.distributeShapes();
};

ShapeTable.prototype.distributeShapes = function () {
    this.cells = [];
    this.table = {};
    this.shapes.forEach((shape, i) => {
        const file = Math.floor(i / this.numColumns);
        const rank = i % this.numColumns;
        const cell = new ShapeCell(rank, file, shape);
        this.cells.push(cell);
        this.table[rank] = this.table[rank] || {};
        this.table[rank][file] = cell;
    });
    this.reAnchorShapes();
};

ShapeTable.prototype.reAnchorShapes = function () {
    const rows = this.getRows();
    const cols = this.getColumns();

    let netHeight = 0;
    rows.forEach((row, i) => {
        const y = this.anchorPoint.y + (this.padding * i) + netHeight;
        row.cells.forEach(cell => {
            cell.setY(y);
            cell.height = row.maxHeight;
        });
        netHeight += row.maxHeight;
    });
    let netWidth = 0;
    cols.forEach((col, i) => {
        const x = this.anchorPoint.x + (this.padding * i) + netWidth;
        col.cells.forEach(cell => {
            cell.setX(x);
            cell.width = col.maxWidth;
        });
        netWidth += col.maxWidth;
    });

    this.cells.forEach((cell) => {
        if (cell.anchorPoint && cell.shape) {
            const shapeBox = new BoundingBox(cell.shape);
            const xD = (cell.width - shapeBox.width) / 2;
            const yD = (cell.height - shapeBox.height) / 2;
            cell.shape.setAnchorPoint(cell.anchorPoint.shift(xD, yD));
        }
    });
};

ShapeTable.prototype.setNumRows = function (numRows) {
    this.numRows = numRows;
};

ShapeTable.prototype.setNumColumns = function (numColumns) {
    this.numColumns = numColumns;
    for (let x = 0; x < this.numColumns; x++) {
        this.table[x] = this.table[x] || {};
    }
};

ShapeTable.prototype.getRow = function (y) {
    const row = [];
    for(let i = 0; i < this.numColumns; i++) {
        if (this.table[i] && this.table[i][y]) {
            row.push(this.table[i][y]);
        }
    }
    return new ShapeSpan(row);
};

ShapeTable.prototype.getRows = function() {
    const rows = [];
    for(let i = 0; i < this.numRows; i++) {
        rows.push(this.getRow(i));
    }
    return rows;
};

ShapeTable.prototype.getColumn = function (x) {
    const column = [];
    for(let i = 0; i < this.numRows; i++) {
        if (this.table[x][i]) {
            column.push(this.table[x][i]);
        }
    }
    return new ShapeSpan(column);
};

ShapeTable.prototype.getColumns = function () {
    const columns = [];
    for(let i = 0; i < this.numColumns; i++) {
        columns.push(this.getColumn(i));
    }
    return columns;
};

ShapeTable.prototype.draw = function (ctx) {
    this.cells.forEach(c => {
        if (c.shape) {
            c.shape.draw(ctx);
        }
    });
};

