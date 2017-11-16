export default class Vector {

  static fromObject(object, xProp = 'x', yProp = 'y') {
    return new Vector(object[xProp], object[yProp]);
  }

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add({ x = 0, y = 0 }) {
    return new Vector(this.x + x, this.y + y);
  }

  subtract({ x = 0, y = 0 }) {
    return new Vector(this.x - x, this.y - y);
  }

  divide(value) {
    return new Vector(this.x / value, this.y / value);
  }

  isBiggerThan({ x = null, y = null }) {
    return (
      (x == null || this.x > x) &&
      (y == null || this.y > y)
    );
  }

  isLowerThan({ x = null, y = null }) {
    return (
      (x == null || this.x < x) &&
      (y == null || this.y < y)
    );
  }

  isBiggerEqualThan({ x = null, y = null }) {
    return (
      (x == null || this.x >= x) &&
      (y == null || this.y >= y)
    );
  }

  isLowerEqualThan({ x = null, y = null }) {
    return (
      (x == null || this.x <= x) &&
      (y == null || this.y <= y)
    );
  }

  toObject(xProp, yProp) {
    return {
      [xProp]: this.x,
      [yProp]: this.y,
    };
  }
}


Vector.zero = new Vector(0, 0);
