class Star {
  constructor(size, x, y) {
    this.size = size;
    this.x = x;
    this.y = y;
  }
}

export default class Starfield {
  constructor(context, scale, { x: velocityX, y: velocityY }, { x: maxX, y: maxY }) {
    this.ctx = context;
    this.stars = [];
    this.scale = scale;
    this.velocityX = velocityX;
    this.velocityY = velocityY;
    this.totalElapsedMilliseconds = 0;
    this.maxX = maxX;
    this.maxY = maxY;
    let starCount = (Math.random() * 100) + 3;
    for (let i = 0; i < starCount; ++i) {
      let radius = scale * (Math.random() * 3) + 1;
      let x = (Math.random() * maxX) + 20;
      let y = (Math.random() * maxY)+ 20;
      this.stars.push(new Star(radius, x, y));
    }
  }

  update(elapsed) {
    let elapsedMsSinceLastFrame = elapsed-this.totalElapsedMilliseconds;
    let xMove = elapsedMsSinceLastFrame * this.velocityX;
    let yMove = elapsedMsSinceLastFrame * this.velocityY;
    if (isNaN(xMove) || isNaN(yMove)) return;
    for (let i = 0; i < this.stars.length; ++i) {

      // 1. move stars
      // 2. if the star is out of bounds, move it to ensure it gets displayed again

      this.stars[i].x += xMove;
      this.stars[i].y += yMove;
      if (this.stars[i].x < 0) {
        this.stars[i].x = this.maxX;
      }
      if (this.stars[i].x > this.maxX) {
        this.stars
        [i].x = 0;
      }
      if (this.stars[i].y < 0) {
        this.stars[i].y = this.maxY;
      }
      if (this.stars[i].y > this.maxY) {
        this.stars[i].y = 0;
      }
    }

    this.totalElapsedMilliseconds = elapsed;
  };

  render() {
    const {ctx} = this;

    for(let i = 0; i < this.stars.length; ++i) {
      ctx.beginPath();
      ctx.fillStyle = 'white';
      ctx.arc(this.stars[i].x, this.stars[i].y, this.stars[i].size, 0, 2 * Math.PI, false);
      ctx.fill();
    }
  };
}
