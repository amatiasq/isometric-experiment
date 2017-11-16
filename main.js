const Vector = amq.Vector;
import Starfield from './starfield';
import tileMap from './tile-map';
import textures from './tile-textures';


function render() {
  clearCanvas();

  // Background
  starfields.forEach(starfield => starfield.render());

  map.render(context);

  renderObjects();
  renderUI();
}

function clearCanvas() {
  tileStart = new Vector(canvasSize.x / 2 - 50, canvasSize.y / 2 - 200);
  context.fillStyle = '#151d26';
  context.fillRect(0, 0, canvasSize.x, canvasSize.y);
}


class TileMap {
  constructor(map, tileSize, visualTileSize) {
    const size = getGridSize(map);
    this.size = new Vector(size, size);
    this.map = map;
    this.tileSize = new Vector(tileSize, tileSize);
    this.visualTileSize = visualTileSize;
  }

  render(context) {
    tileStart
    const tileHalfSize = tileSize.divide(2);
    const tileIndex = new Vector(0, 0);

    for (tileIndex.x = 0; tileIndex.x < GRID_SIZE; tileIndex.x++) {
      for (tileIndex.y = 0; tileIndex.y < GRID_SIZE; tileIndex.y++) {
        const coords = new Vector(
          start.x + (tileIndex.x - tileIndex.y) * tileHalfSize.x,
          start.y + (tileIndex.x + tileIndex.y) * tileHalfSize.y
        );

        const tile = tileMap[tileIndex.y * GRID_SIZE + tileIndex.x];

        if (tile === tileType.empty) {
          renderTileBackground(coords.add({ y: 48 }), tileSize);
        } else {
          renderTexturedTile(tileImages[tile], coords, 80);
        }
      }
    }

    if (!isHover()) {
      return;
    }

    const coords = new Vector(
      start.x + (hoverTile.x - hoverTile.y) * tileHalfSize.x,
      start.y + (hoverTile.x + hoverTile.y) * tileHalfSize.y,
    );

    renderTileHover(coords.add({ y: 48 }), tileSize);  }
}


const map = new TileMap(tileMap, 72, new Vector(96, 48));
const GRID_SIZE = getGridSize(tileMap);
const MAP_SIZE = new Vector(GRID_SIZE, GRID_SIZE);
const TILE_SIZE = 72;
const canvas = document.querySelector('.le-canvas');
const context = canvas.getContext('2d');
const tileImages = textures.map(src => Object.assign(new Image(), {src}))
const tileType = { empty: 0 };
const starfields = [];

let mousePosition = new Vector(0, 0);
let tileStart = new Vector(0, 0);
let hoverTile = new Vector(-1, -1);
let isMouseDown = false;
let selectedTileType = 0;
let maxSelectorsPerRow;
let canvasSize;


window.addEventListener('touchmove', event => {
  updateMousePosition(event);
  event.preventDefault();
}, false);

canvas.addEventListener('mousemove', updateMousePosition, false);
window.addEventListener('touchstart', onMouseDown, false);
canvas.addEventListener('mousedown', onMouseDown, false);
window.addEventListener('touchend', onMouseUp, false);
canvas.addEventListener('mouseup', onMouseUp, false);
window.addEventListener('resize', resizeCanvas, false);


resizeCanvas();
setup();
run();


function setup() {
  starfields.push(new Starfield(context, 0.1, {x: 0.01, y: 0.005}, canvasSize));
  starfields.push(new Starfield(context, 0.6, {x: 0.02, y: 0.022}, canvasSize));
  starfields.push(new Starfield(context, 1.1, {x: 0.04, y: 0.028}, canvasSize));
}

function update(elapsed) {
  const tileSize = new Vector(96, 48);
  const mouse = mousePosition.subtract(tileStart);

  hoverTile = new Vector(
    Math.floor((mouse.y / tileSize.y) + (mouse.x / tileSize.x)) -1,
    Math.floor((-mouse.x / tileSize.x) + (mouse.y / tileSize.y))
  );

  starfields.forEach(starfield => starfield.update(elapsed));

  if (!isMouseDown || !isHover()) {
    return;
  }

  const tileIndex = hoverTile.y * GRID_SIZE + hoverTile.x;

  if (tileIndex > tileMap.length) {
    throw new Error('what the fuck man');
  }

  tileMap[tileIndex] = selectedTileType;
}


function run(event) {
  update(event);
  render();
  window.requestAnimationFrame(run);
}


function renderUI() {
  renderTileSelectors();
}


function renderTileSelectors() {
  const selectorSize = new Vector(48, 48);
  const rendering = new Vector(0, 0);
  let renderRow = 0;
  let renderColumn = 0;

  tileImages.forEach((image, index) => {
    if (rendering.x >= maxSelectorsPerRow) {
      rendering.x = 0;
      rendering.y++;
    }

    renderTileSelector(selectorSize, rendering, image, index === selectedTileType);
    rendering.x++;
  });
}


function renderTileSelector(selectorSize, position, image, isSelected) {
  const coords = new Vector(
    (selectorSize.x + 20) * position.x + 20,
    (selectorSize.y + 20) * position.y + 20
  );

  renderSelectorBackground(coords, selectorSize, isSelected);
  context.drawImage(image, coords.x, coords.y, selectorSize.x, selectorSize.y);
}


function renderSelectorBackground(coords, selectorSize, isSelected) {
  const isMouseOver = (
    mousePosition.x >= coords.x && mousePosition.x <= coords.x + selectorSize.x &&
    mousePosition.y >= coords.y && mousePosition.y <= coords.y + selectorSize.y
  );

  let color = 'rgba(0, 0, 0, 0.4)';

  if (isSelected) {
    color = 'rgba(192, 57, 43,1.0)';
  } else if (isMouseOver) {
    color = 'rgba(192, 57, 43, 0.8)';
  }

  context.beginPath();
  context.setLineDash([]);
  context.strokeStyle = color;
  context.fillStyle = 'rgba(0, 0, 0, 0.4)';
  context.lineWidth = isSelected ? 4 : 2;
  context.moveTo(coords.x, coords.y);
  context.lineTo(coords.x + selectorSize.x, coords.y);
  context.lineTo(coords.x + selectorSize.x, coords.y + selectorSize.y);
  context.lineTo(coords.x, coords.y + selectorSize.y);
  context.lineTo(coords.x, coords.y);
  context.stroke();
  context.fill();
}


function renderMouseAndGridPosition() {
  const mouseOverGrid = isHover() ? `Grid: ${hoverTile.x}, ${hoverTile.y}` : '';

  context.font = '12pt Calibri';
  context.fillStyle = 'white';
  context.fillText(`Mouse: ${mousePosition.x}, ${mousePosition.y}`, 20, 100);
  context.fillText(`${mouseOverGrid}`, 20, 120);
}


function renderObjects() { }


function renderTiles(start) {

}


function onMouseClick() {
  if (isHover()) {
    return;
  }

  const position = new Vector(0, 0);
  let selectedIndex = null;

  textures.forEach((texture, i) => {
    let rowSize = maxSelectorsPerRow;

    if (position.x >= rowSize) {
      position.x = 0;
      position.y++;
    }

    const start = new Vector(
      (48 + 20) * position.x + 20,
      (48 + 20) * position.y + 20
    );

    const end = start.add({ x: 48, y: 48 });

    if (mousePosition.isBiggerEqualThan(start) && mousePosition.isLowerEqualThan(end)) {
      selectedIndex = i;
    }

    position.x++;
  });

  if (selectedIndex != null) {
    selectedTileType = selectedIndex;
  }
}


function renderTexturedTile(img, position, tileHeight) {
  let offsetY = tileHeight - img.height;
  context.drawImage(img, position.x, position.y + offsetY);
}


function renderTileHover(position, size) {
  context.beginPath();
  context.setLineDash([]);
  context.strokeStyle = 'rgba(192, 57, 43, 0.8)';
  context.fillStyle = 'rgba(192, 57, 43, 0.4)';
  context.lineWidth = 2;
  context.moveTo(position.x, position.y);
  context.lineTo(position.x + size.x / 2, position.y - size.y / 2);
  context.lineTo(position.x + size.x, position.y);
  context.lineTo(position.x + size.x / 2, position.y + size.y / 2);
  context.lineTo(position.x, position.y);
  context.stroke();
  context.fill();
}


function renderTileBackground(position, size) {
  context.beginPath();
  context.setLineDash([5, 5]);
  context.strokeStyle = 'rgba(255,255,255,0.4)';
  context.fillStyle = 'rgba(25,34, 44,0.2)';
  context.lineWidth = 1;
  context.moveTo(position.x, position.y);
  context.lineTo(position.x + size.x / 2, position.y - size.y / 2);
  context.lineTo(position.x + size.x, position.y);
  context.lineTo(position.x + size.x / 2, position.y + size.y / 2);
  context.lineTo(position.x, position.y);
  context.stroke();
  context.fill();
}



function getGridSize(tiles) {
  const sqrt = Math.sqrt(tiles.length);

  if (sqrt !== Math.round(sqrt)) {
    throw new Error(`The tile map is not a square`);
  }

  return sqrt;
}


function resizeCanvas() {
  canvasSize = Vector.fromObject(window, 'innerWidth', 'innerHeight');
  maxSelectorsPerRow = canvasSize.x / TILE_SIZE;

  Object.assign(canvas, canvasSize.toObject('width', 'height'));
}


function getMousePosition(canvas, event) {
  const mouse = Vector.fromObject(event, 'clientX', 'clientY');
  const offset = Vector.fromObject(canvas.getBoundingClientRect(), 'left', 'top');
  return mouse.subtract(offset);
}


function updateMousePosition(event) {
  mousePosition = getMousePosition(canvas, event);
}


function onMouseDown(event) {
  isMouseDown = true
}


function onMouseUp(evt) {
  if (isMouseDown === true) {
    onMouseClick();
  }

  isMouseDown = false;
}


function isHover() {
  return hoverTile.isBiggerEqualThan(Vector.zero) && hoverTile.isLowerThan(MAP_SIZE);
}
