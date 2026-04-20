// Breakout — terminal-styled brick breaker
// Easter egg for 757btc.org
(function () {
  'use strict';

  var GREEN = '#00ff41';
  var GREEN_DIM = '#00aa00';
  var GREEN_GLOW = 'rgba(0, 255, 65, 0.5)';
  var BLACK = '#0a0a0a';
  var WHITE = '#ffffff';

  var canvas, ctx, container, exitCallback;
  var animFrame = null;
  var running = false;

  // Game state
  var state = {};
  var HIGH_SCORE_KEY = '757btc_breakout_hi';

  function defaultState() {
    return {
      // Paddle
      paddleW: 80,
      paddleH: 10,
      paddleX: 0,
      paddleSpeed: 6,

      // Ball
      ballR: 5,
      ballX: 0,
      ballY: 0,
      ballDX: 3,
      ballDY: -3,
      ballSpeed: 3,

      // Bricks
      brickRows: 5,
      brickCols: 8,
      brickW: 0,
      brickH: 18,
      brickPad: 4,
      brickOffsetTop: 50,
      brickOffsetLeft: 0,
      bricks: [],

      // Score
      score: 0,
      lives: 3,
      level: 1,
      highScore: parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0,

      // Input
      leftPressed: false,
      rightPressed: false,
      touchX: null,

      // State
      paused: false,
      gameOver: false,
      started: false
    };
  }

  function initBricks() {
    var totalPad = state.brickPad * (state.brickCols + 1);
    state.brickW = (canvas.width - totalPad) / state.brickCols;
    state.brickOffsetLeft = state.brickPad;

    state.bricks = [];
    for (var r = 0; r < state.brickRows; r++) {
      state.bricks[r] = [];
      for (var c = 0; c < state.brickCols; c++) {
        state.bricks[r][c] = { alive: true, hits: r < 2 ? 2 : 1 };
      }
    }
  }

  function resetBall() {
    state.ballX = canvas.width / 2;
    state.ballY = canvas.height - 50;
    var angle = (Math.random() * 0.8 + 0.6) * (Math.random() < 0.5 ? 1 : -1);
    state.ballDX = state.ballSpeed * Math.sin(angle);
    state.ballDY = -state.ballSpeed * Math.cos(angle);
    state.started = false;
  }

  function resizeCanvas() {
    var rect = container.getBoundingClientRect();
    var w = Math.min(rect.width - 20, 600);
    var h = Math.min(rect.height - 20, 500);
    canvas.width = w;
    canvas.height = h;
    state.paddleX = (w - state.paddleW) / 2;
  }

  // Drawing
  function drawRect(x, y, w, h, color, glow) {
    if (glow) {
      ctx.shadowColor = GREEN_GLOW;
      ctx.shadowBlur = 8;
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.shadowBlur = 0;
  }

  function drawBall() {
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, state.ballR, 0, Math.PI * 2);
    ctx.fillStyle = GREEN;
    ctx.shadowColor = GREEN_GLOW;
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.closePath();
  }

  function drawPaddle() {
    drawRect(
      state.paddleX,
      canvas.height - state.paddleH - 10,
      state.paddleW,
      state.paddleH,
      GREEN,
      true
    );
  }

  function drawBricks() {
    for (var r = 0; r < state.brickRows; r++) {
      for (var c = 0; c < state.brickCols; c++) {
        var b = state.bricks[r][c];
        if (!b.alive) continue;

        var x = state.brickOffsetLeft + c * (state.brickW + state.brickPad);
        var y = state.brickOffsetTop + r * (state.brickH + state.brickPad);

        var color = b.hits > 1 ? GREEN : GREEN_DIM;
        drawRect(x, y, state.brickW, state.brickH, color, false);

        // Border
        ctx.strokeStyle = GREEN;
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, state.brickW, state.brickH);
      }
    }
  }

  function drawHUD() {
    ctx.font = '14px "Share Tech Mono", "Courier New", monospace';
    ctx.fillStyle = GREEN;
    ctx.shadowColor = GREEN_GLOW;
    ctx.shadowBlur = 4;

    ctx.textAlign = 'left';
    ctx.fillText('SCORE: ' + state.score, 10, 20);

    ctx.textAlign = 'center';
    ctx.fillText('LIVES: ' + state.lives, canvas.width / 2, 20);

    ctx.textAlign = 'right';
    ctx.fillText('HI: ' + state.highScore, canvas.width - 10, 20);

    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';

    // Level indicator
    ctx.font = '10px "Share Tech Mono", "Courier New", monospace';
    ctx.fillStyle = GREEN_DIM;
    ctx.fillText('LVL ' + state.level, 10, 36);
  }

  function drawStartScreen() {
    ctx.font = '14px "Share Tech Mono", "Courier New", monospace';
    ctx.fillStyle = GREEN;
    ctx.textAlign = 'center';
    ctx.shadowColor = GREEN_GLOW;
    ctx.shadowBlur = 6;
    ctx.fillText('[ PRESS SPACE OR TAP TO LAUNCH ]', canvas.width / 2, canvas.height - 70);
    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
  }

  function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = '24px "Share Tech Mono", "Courier New", monospace';
    ctx.fillStyle = GREEN;
    ctx.textAlign = 'center';
    ctx.shadowColor = GREEN_GLOW;
    ctx.shadowBlur = 10;
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = '14px "Share Tech Mono", "Courier New", monospace';
    ctx.fillText('SCORE: ' + state.score, canvas.width / 2, canvas.height / 2 + 10);

    if (state.score >= state.highScore && state.score > 0) {
      ctx.fillStyle = WHITE;
      ctx.fillText('★ NEW HIGH SCORE ★', canvas.width / 2, canvas.height / 2 + 35);
    }

    ctx.fillStyle = GREEN_DIM;
    ctx.font = '12px "Share Tech Mono", "Courier New", monospace';
    ctx.fillText('press SPACE to restart or ESC to exit', canvas.width / 2, canvas.height / 2 + 65);

    // NIP-07 leaderboard prompt
    if (window.nostr && state.score > 0) {
      ctx.fillStyle = GREEN;
      ctx.fillText('press N to post score to nostr leaderboard', canvas.width / 2, canvas.height / 2 + 85);
    }

    ctx.shadowBlur = 0;
    ctx.textAlign = 'left';
  }

  // Collision
  function brickCollision() {
    for (var r = 0; r < state.brickRows; r++) {
      for (var c = 0; c < state.brickCols; c++) {
        var b = state.bricks[r][c];
        if (!b.alive) continue;

        var bx = state.brickOffsetLeft + c * (state.brickW + state.brickPad);
        var by = state.brickOffsetTop + r * (state.brickH + state.brickPad);

        if (
          state.ballX + state.ballR > bx &&
          state.ballX - state.ballR < bx + state.brickW &&
          state.ballY + state.ballR > by &&
          state.ballY - state.ballR < by + state.brickH
        ) {
          state.ballDY = -state.ballDY;
          b.hits--;
          if (b.hits <= 0) {
            b.alive = false;
            state.score += (r < 2) ? 20 : 10;
          } else {
            state.score += 5;
          }
          return;
        }
      }
    }
  }

  function allBricksCleared() {
    for (var r = 0; r < state.brickRows; r++) {
      for (var c = 0; c < state.brickCols; c++) {
        if (state.bricks[r][c].alive) return false;
      }
    }
    return true;
  }

  function nextLevel() {
    state.level++;
    state.ballSpeed += 0.5;
    initBricks();
    resetBall();
  }

  // Update
  function update() {
    if (state.paused || state.gameOver || !state.started) return;

    // Paddle movement
    if (state.leftPressed && state.paddleX > 0) {
      state.paddleX -= state.paddleSpeed;
    }
    if (state.rightPressed && state.paddleX < canvas.width - state.paddleW) {
      state.paddleX += state.paddleSpeed;
    }

    // Touch
    if (state.touchX !== null) {
      var target = state.touchX - state.paddleW / 2;
      state.paddleX += (target - state.paddleX) * 0.2;
      state.paddleX = Math.max(0, Math.min(canvas.width - state.paddleW, state.paddleX));
    }

    // Ball
    state.ballX += state.ballDX;
    state.ballY += state.ballDY;

    // Wall collisions
    if (state.ballX - state.ballR < 0 || state.ballX + state.ballR > canvas.width) {
      state.ballDX = -state.ballDX;
      state.ballX = Math.max(state.ballR, Math.min(canvas.width - state.ballR, state.ballX));
    }
    if (state.ballY - state.ballR < 0) {
      state.ballDY = -state.ballDY;
      state.ballY = state.ballR;
    }

    // Paddle collision
    var paddleTop = canvas.height - state.paddleH - 10;
    if (
      state.ballY + state.ballR >= paddleTop &&
      state.ballY + state.ballR <= paddleTop + state.paddleH + 4 &&
      state.ballX >= state.paddleX &&
      state.ballX <= state.paddleX + state.paddleW
    ) {
      // Angle based on where ball hits paddle
      var hitPos = (state.ballX - state.paddleX) / state.paddleW; // 0-1
      var angle = (hitPos - 0.5) * Math.PI * 0.7; // -63° to +63°
      var speed = Math.sqrt(state.ballDX * state.ballDX + state.ballDY * state.ballDY);
      state.ballDX = speed * Math.sin(angle);
      state.ballDY = -speed * Math.abs(Math.cos(angle));
      state.ballY = paddleTop - state.ballR;
    }

    // Bottom — lose life
    if (state.ballY + state.ballR > canvas.height) {
      state.lives--;
      if (state.lives <= 0) {
        endGame();
      } else {
        resetBall();
      }
    }

    // Brick collision
    brickCollision();

    // Level clear
    if (allBricksCleared()) {
      nextLevel();
    }
  }

  function endGame() {
    state.gameOver = true;
    if (state.score > state.highScore) {
      state.highScore = state.score;
      localStorage.setItem(HIGH_SCORE_KEY, state.score);
    }
  }

  // NIP-07 Nostr score posting
  function postScoreToNostr() {
    if (!window.nostr || state.score <= 0) return;

    var event = {
      kind: 30069,
      created_at: Math.floor(Date.now() / 1000),
      tags: [
        ['d', '757btc-breakout'],
        ['score', String(state.score)],
        ['level', String(state.level)],
        ['L', 'com.757btc.game'],
        ['l', 'breakout', 'com.757btc.game'],
        ['r', 'https://757btc.org']
      ],
      content: 'Scored ' + state.score + ' points in 757btc Breakout (level ' + state.level + ') 🧱⚡'
    };

    window.nostr.signEvent(event).then(function (signed) {
      // Publish to 757btc relay
      var relays = ['wss://relay.757btc.org', 'wss://relay.damus.io'];
      relays.forEach(function (url) {
        try {
          var ws = new WebSocket(url);
          ws.onopen = function () {
            ws.send(JSON.stringify(['EVENT', signed]));
            setTimeout(function () { ws.close(); }, 3000);
          };
        } catch (e) { /* silent */ }
      });

      // Show confirmation
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 + 95, 300, 30);
      ctx.font = '12px "Share Tech Mono", "Courier New", monospace';
      ctx.fillStyle = GREEN;
      ctx.textAlign = 'center';
      ctx.fillText('✓ score posted to nostr!', canvas.width / 2, canvas.height / 2 + 115);
      ctx.textAlign = 'left';
    }).catch(function () {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(canvas.width / 2 - 150, canvas.height / 2 + 95, 300, 30);
      ctx.font = '12px "Share Tech Mono", "Courier New", monospace';
      ctx.fillStyle = '#ff4444';
      ctx.textAlign = 'center';
      ctx.fillText('✗ signing failed or cancelled', canvas.width / 2, canvas.height / 2 + 115);
      ctx.textAlign = 'left';
    });
  }

  // Render
  function draw() {
    ctx.fillStyle = BLACK;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.03)';
    ctx.lineWidth = 0.5;
    for (var x = 0; x < canvas.width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (var y = 0; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    drawBricks();
    drawPaddle();
    if (!state.gameOver) drawBall();
    drawHUD();

    if (!state.started && !state.gameOver) drawStartScreen();
    if (state.gameOver) drawGameOver();
  }

  function gameLoop() {
    if (!running) return;
    update();
    draw();
    animFrame = requestAnimationFrame(gameLoop);
  }

  // Input handlers
  function onKeyDown(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') state.leftPressed = true;
    if (e.key === 'ArrowRight' || e.key === 'd') state.rightPressed = true;
    if (e.key === ' ') {
      e.preventDefault();
      if (state.gameOver) {
        restartGame();
      } else if (!state.started) {
        state.started = true;
      }
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      stop();
      if (exitCallback) exitCallback();
    }
    if (e.key === 'n' || e.key === 'N') {
      if (state.gameOver) postScoreToNostr();
    }
  }

  function onKeyUp(e) {
    if (e.key === 'ArrowLeft' || e.key === 'a') state.leftPressed = false;
    if (e.key === 'ArrowRight' || e.key === 'd') state.rightPressed = false;
  }

  function onTouchStart(e) {
    e.preventDefault();
    if (state.gameOver) {
      restartGame();
      return;
    }
    if (!state.started) {
      state.started = true;
    }
    var rect = canvas.getBoundingClientRect();
    state.touchX = e.touches[0].clientX - rect.left;
  }

  function onTouchMove(e) {
    e.preventDefault();
    var rect = canvas.getBoundingClientRect();
    state.touchX = e.touches[0].clientX - rect.left;
  }

  function onTouchEnd(e) {
    e.preventDefault();
    state.touchX = null;
  }

  function onMouseMove(e) {
    var rect = canvas.getBoundingClientRect();
    var mouseX = e.clientX - rect.left;
    state.paddleX = mouseX - state.paddleW / 2;
    state.paddleX = Math.max(0, Math.min(canvas.width - state.paddleW, state.paddleX));
  }

  function onMouseClick(e) {
    e.preventDefault();
    if (state.gameOver) {
      restartGame();
    } else if (!state.started) {
      state.started = true;
    }
  }

  function restartGame() {
    state = defaultState();
    resizeCanvas();
    initBricks();
    resetBall();
    state.highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0;
  }

  function start(containerEl, onExit) {
    container = containerEl;
    exitCallback = onExit;

    canvas = document.createElement('canvas');
    canvas.id = 'breakout-canvas';
    canvas.style.display = 'block';
    canvas.style.margin = '0 auto';
    canvas.style.background = BLACK;
    container.appendChild(canvas);
    ctx = canvas.getContext('2d');

    state = defaultState();
    resizeCanvas();
    initBricks();
    resetBall();
    state.highScore = parseInt(localStorage.getItem(HIGH_SCORE_KEY)) || 0;

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd, { passive: false });
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onMouseClick);

    running = true;
    gameLoop();
  }

  function stop() {
    running = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    document.removeEventListener('keydown', onKeyDown);
    document.removeEventListener('keyup', onKeyUp);
    if (canvas) {
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onMouseClick);
      canvas.remove();
    }
    canvas = null;
    ctx = null;
  }

  window.breakoutGame = { start: start, stop: stop };
})();
