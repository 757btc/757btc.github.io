// Terminal — HUD prompt input + overlay for output/games
(function () {
  'use strict';

  var overlay = null;
  var outputEl = null;
  var hudInput = null;
  var history = [];
  var historyIndex = -1;
  var gameActive = false;
  var posterData = null;

  // Load poster-data.json
  function loadPosterData() {
    fetch('/assets/data/poster-data.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) { posterData = data; })
      .catch(function () { posterData = null; });
  }

  // --- Overlay (output only, no input) ---

  function createOverlay() {
    overlay = document.createElement('div');
    overlay.id = 'terminal-overlay';
    overlay.innerHTML =
      '<div class="terminal-window">' +
        '<div class="terminal-header">' +
          '<span class="terminal-title">757btc terminal</span>' +
          '<span class="terminal-close">[x]</span>' +
        '</div>' +
        '<div class="terminal-body" id="terminal-output"></div>' +
      '</div>';
    document.body.appendChild(overlay);

    outputEl = document.getElementById('terminal-output');

    overlay.querySelector('.terminal-close').addEventListener('click', closeOverlay);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeOverlay();
    });
  }

  function openOverlay() {
    if (!overlay) createOverlay();
    outputEl.innerHTML = '';
    outputEl.style.display = '';
    overlay.classList.add('active');
    document.body.classList.add('terminal-open');
    // Dismiss mobile keyboard
    if (hudInput) hudInput.blur();
    if (document.activeElement) document.activeElement.blur();
  }

  function closeOverlay() {
    if (gameActive && window.breakoutGame) {
      window.breakoutGame.stop();
      gameActive = false;
    }
    if (overlay) overlay.classList.remove('active');
    document.body.classList.remove('terminal-open');
    // Refocus the HUD input
    if (hudInput) {
      hudInput.value = '';
      hudInput.placeholder = 'system online';
    }
  }

  function writeLine(text) {
    if (!outputEl) return;
    var line = document.createElement('div');
    line.className = 'terminal-line';
    line.textContent = text;
    outputEl.appendChild(line);
    outputEl.scrollTop = outputEl.scrollHeight;
  }

  // --- HUD prompt input ---

  function handleHudInput(e) {
    if (e.key === 'Enter') {
      var cmd = hudInput.value.trim().toLowerCase();
      hudInput.value = '';
      if (cmd) {
        history.push(cmd);
        historyIndex = history.length;
        processCommand(cmd);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        hudInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        historyIndex++;
        hudInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        hudInput.value = '';
      }
    } else if (e.key === 'Escape') {
      hudInput.value = '';
      hudInput.blur();
    }
    // Stop propagation so page shortcuts don't fire
    e.stopPropagation();
  }

  // --- Commands ---

  function processCommand(cmd) {
    var commands = {
      help: cmdHelp,
      meetups: cmdMeetups,
      links: cmdLinks,
      about: cmdAbout,
      clear: cmdClear,
      // Easter eggs — not listed in help
      breakout: cmdBreakout,
      play: cmdBreakout,
      matrix: cmdMatrix,
      satoshi: cmdSatoshi,
      '21m': cmd21m
    };

    var fn = commands[cmd];
    if (fn) {
      fn();
    } else {
      // Flash an error in the placeholder briefly
      hudInput.placeholder = 'unknown command: ' + cmd;
      setTimeout(function () {
        hudInput.placeholder = 'system online';
      }, 2000);
    }
  }

  function cmdHelp() {
    openOverlay();
    writeLine('757btc terminal v1.0');
    writeLine('');
    writeLine('available commands:');
    writeLine('  meetups   — upcoming bitcoin meetups in the 757');
    writeLine('  links     — useful links and resources');
    writeLine('  about     — about 757btc');
    writeLine('  clear     — close overlay');
    writeLine('  help      — this message');
    writeLine('');
    writeLine('hint: there may be more commands than listed...');
    writeLine('');
  }

  function cmdMeetups() {
    openOverlay();
    if (!posterData || !posterData.meetups) {
      writeLine('meetup data unavailable');
      return;
    }
    writeLine(posterData.meetups.title);
    writeLine('');
    posterData.meetups.list.forEach(function (m) {
      var time = m.time ? ' @ ' + m.time : '';
      writeLine('  ▸ ' + m.frequency + (m.schedule ? ' ' + m.schedule : '') + time);
      writeLine('    ' + m.location);
    });
    writeLine('');
  }

  function cmdLinks() {
    openOverlay();
    if (!posterData || !posterData.links) {
      writeLine('link data unavailable');
      return;
    }
    posterData.links.forEach(function (l) {
      writeLine('  ' + l.label);
      writeLine('    → ' + l.url);
    });
    writeLine('');
  }

  function cmdAbout() {
    openOverlay();
    writeLine('');
    writeLine('757btc — Hampton Roads Bitcoin Community');
    writeLine('monthly meetups since February 2024');
    writeLine('we build, learn, and stack together');
    writeLine('');
    writeLine('"privacy is the power to selectively');
    writeLine(' reveal oneself to the world."');
    writeLine('');
  }

  function cmdClear() {
    closeOverlay();
  }

  // Easter eggs

  function cmdBreakout() {
    if (!window.breakoutGame) {
      hudInput.placeholder = 'loading...';
      var script = document.createElement('script');
      script.src = '/assets/js/breakout.js';
      script.onload = function () {
        startBreakout();
      };
      script.onerror = function () {
        hudInput.placeholder = 'error: game not available';
        setTimeout(function () { hudInput.placeholder = 'system online'; }, 2000);
      };
      document.head.appendChild(script);
    } else {
      startBreakout();
    }
  }

  function startBreakout() {
    openOverlay();
    gameActive = true;

    // Hide the text output, show game
    var body = overlay.querySelector('.terminal-body');
    body.style.display = 'none';

    var gameContainer = document.createElement('div');
    gameContainer.id = 'breakout-container';
    overlay.querySelector('.terminal-window').appendChild(gameContainer);

    window.breakoutGame.start(gameContainer, function () {
      // Game exited
      gameActive = false;
      gameContainer.remove();
      body.style.display = '';
      closeOverlay();
    });
  }

  function cmdMatrix() {
    openOverlay();
    writeLine('');
    writeLine('wake up, neo...');
    writeLine('the matrix has you...');
    writeLine('follow the white rabbit.');
    writeLine('');
  }

  function cmdSatoshi() {
    openOverlay();
    writeLine('');
    writeLine('chancellor on brink of second bailout for banks');
    writeLine('— the times, 3 january 2009');
    writeLine('');
  }

  function cmd21m() {
    openOverlay();
    writeLine('');
    writeLine('▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ 100%');
    writeLine('21,000,000 — no more, no less');
    writeLine('');
  }

  // --- Init ---

  function init() {
    loadPosterData();

    hudInput = document.getElementById('hud-input');
    if (!hudInput) return;

    hudInput.addEventListener('keydown', handleHudInput);

    // Close overlay on Escape anywhere
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
        closeOverlay();
      }
      // Backtick focuses the HUD input
      if (e.key === '`' && !gameActive && document.activeElement !== hudInput && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
        e.preventDefault();
        hudInput.focus();
        hudInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.terminal757 = {
    open: openOverlay,
    close: closeOverlay,
    writeLine: writeLine
  };
})();
