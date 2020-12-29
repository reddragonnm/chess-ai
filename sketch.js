let white_king;
let white_knight;
let white_rook;
let white_pawn;
let white_queen;
let white_bishop;

let black_king;
let black_knight;
let black_rook;
let black_pawn;
let black_queen;
let black_bishop;

function preload() {
  white_king = loadImage("assets/white_king.png");
  white_knight = loadImage("assets/white_knight.png");
  white_rook = loadImage("assets/white_rook.png");
  white_pawn = loadImage("assets/white_pawn.png");
  white_bishop = loadImage("assets/white_bishop.png");
  white_queen = loadImage("assets/white_queen.png");

  black_king = loadImage("assets/black_king.png");
  black_knight = loadImage("assets/black_knight.png");
  black_rook = loadImage("assets/black_rook.png");
  black_pawn = loadImage("assets/black_pawn.png");
  black_bishop = loadImage("assets/black_bishop.png");
  black_queen = loadImage("assets/black_queen.png");
}

const tilesize = 60;
const chess = new Chess();

let winner = '';
let winnerP;
let pickedPiece;

function setup() {
  createCanvas(tilesize * 8, tilesize * 8);

  winnerP = createElement('h1', '');

  let undoB = createButton('Undo Move');
  undoB.mousePressed(chess.undo);


  createP('Depth: ');
  depthSel = createSelect();
  for (let i = 1; i < 5; i++) {
    depthSel.option(i);
  }
  depthSel.selected(maxDepth);
  depthSel.changed(() => {
    maxDepth = depthSel.value;
  })
}

function draw() {
  showGrid();
  showBoard();
  showMoves();

  if (winner != '') {
    winnerP.html(winner);
    noLoop();
  }

  if (chess.turn() == 'b' && frameRate % 5 == 0) {
    aiMove();
  }
}

function mousePressed() {
  let i = floor(map(mouseX, 0, width, 0, 8));
  let j = floor(map(mouseY, 0, height, 0, 8));

  if (0 <= i <= 7 && 0 <= j <= 7) pickedPiece = [j, i];
}

function mouseReleased() {
  let i = floor(map(mouseX, 0, width, 0, 8));
  let j = floor(map(mouseY, 0, height, 0, 8));

  if (0 <= i <= 7 && 0 <= j <= 7) {
    let moves = chess.moves({
      square: to_san(...pickedPiece),
      verbose: true
    });

    for (let move of moves) {
      if (move.to == to_san(j, i)) {
        chess.move(move.san);
        checkWinner();
        break;
      }
    }
  }

  pickedPiece = null;
}

function checkWinner() {
  if (chess.in_checkmate()) winner = 'Checkmate by ' + (chess.turn() == 'w' ? 'black' : 'white') + '!';
  if (chess.in_draw()) winner = 'Draw!';
  if (chess.in_stalemate()) winner = 'Draw by stalemate!';
  if (chess.in_threefold_repetition()) winner = 'Draw by threefold repetition!';
  if (chess.insufficient_material()) winner = 'Draw by insufficient material!';
}

function showMoves() {
  noStroke();
  fill(125, 255, 0);

  if (pickedPiece != null) {
    let moves = chess.moves({
      square: to_san(...pickedPiece),
      verbose: true
    });

    for (let move of moves) {
      let p = to_index(move.to);
      circle(p[1] * tilesize + tilesize / 2, p[0] * tilesize + tilesize / 2, 40);
    }
  }
}

function showBoard() {
  let img;
  let board = chess.board();

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let p = board[i][j];
      if (p == null) continue;

      if (p.color == 'w') {
        if (p.type == 'r') img = white_rook;
        if (p.type == 'n') img = white_knight;
        if (p.type == 'b') img = white_bishop;
        if (p.type == 'k') img = white_king;
        if (p.type == 'q') img = white_queen;
        if (p.type == 'p') img = white_pawn;
      } else {
        if (p.type == 'r') img = black_rook;
        if (p.type == 'n') img = black_knight;
        if (p.type == 'b') img = black_bishop;
        if (p.type == 'k') img = black_king;
        if (p.type == 'q') img = black_queen;
        if (p.type == 'p') img = black_pawn;
      }

      if (pickedPiece != null && i == pickedPiece[0] && j == pickedPiece[1]) {
        imageMode(CENTER);
        image(img, mouseX, mouseY, tilesize, tilesize);
      } else {
        imageMode(CORNER);
        image(img, j * tilesize, i * tilesize, tilesize, tilesize);
      }
    }
  }
}

function to_san(i, j) {
  return 'abcdefgh' [j] + (8 - i).toString();
}

function to_index(san) {
  return [8 - parseInt(san[1]), 'abcdefgh'.indexOf(san[0])];
}

function showGrid() {
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 == 0) fill(255);
      else fill(0);

      rect(j * tilesize, i * tilesize, tilesize, tilesize);
    }
  }
}