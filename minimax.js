let maxDepth = 3;
let scores = {
  win: 100,
  lose: 100,
  tie: 0
}

let moveLimit = 20;

function aiMove() {
  let bestScore = -Infinity;
  let bestMove = null;

  for (let move of chess.moves().slice(0, moveLimit)) {
    chess.move(move)
    let score = minimax(chess.board(), maxDepth, false, -Infinity, Infinity);
    chess.undo();

    if (score >= bestScore) {
      bestMove = move;
      bestScore = score;
    }
  }

  // chess.move(random(chess.moves()));
  chess.move(bestMove);
}

function evalStaticBoard(br) {
  let score = 0;

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      let t = br[i][j];

      if (t != null) {
        if (t.color == 'b') {
          if (t.type == 'p') score += 1;
          if (t.type == 'q') score += 9;
          if (t.type == 'r') score += 5;
          if (t.type == 'n') score += 3;
          if (t.type == 'k') score += 0;
          if (t.type == 'b') score += 3;
        } else {
          if (t.type == 'p') score -= 1;
          if (t.type == 'q') score -= 9;
          if (t.type == 'r') score -= 5;
          if (t.type == 'n') score -= 3;
          if (t.type == 'k') score -= 0;
          if (t.type == 'b') score -= 3;
        }
      }
    }
  }

  return score * 5;
}

function minimax(board, depth, isMaximizing, alpha, beta) {
  let nMoves = maxDepth - depth + 1;

  if (chess.in_checkmate()) return (this.turn == 'w' ? scores.win : scores.lose);
  if (chess.in_draw() ||
    chess.in_stalemate() ||
    chess.in_threefold_repetition() ||
    chess.insufficient_material()) return scores.tie;

  if (depth == 0) return evalStaticBoard(board);

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let move of chess.moves().slice(0, moveLimit)) {
      chess.move(move)
      let score = minimax(chess.board(), depth - 1, false, alpha, beta);
      chess.undo();

      bestScore = max(score, bestScore);
      alpha = max(bestScore, alpha);
      if (beta <= alpha) break;
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let move of chess.moves().slice(0, 5)) {
      chess.move(move)
      let score = minimax(chess.board(), depth - 1, true, alpha, beta);
      chess.undo();

      bestScore = min(score, bestScore);
      beta = min(bestScore, beta);
      if (beta <= alpha) break;
    }

    return bestScore;
  }
}