class BodyGame {
  constructor() {
    this.x = 'X';
    this.o = 'O';
    this.move = 1;
    this.gameActive = true;
    this.vsAI = false;
  }
}
class LogicGame extends BodyGame {
  constructor() {
    super();
    this.gameState = ["", "", "", "", "", "", "", "", ""];
    this.winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    this.player = document.getElementById('player-turn');
    this.resetBtn = document.getElementById('reset-btn');
    this.aiToggle = document.querySelector('.checkbox-google input');
    this.sounds = {
      click: new Audio('sounds/click.wav'),
      win: new Audio('sounds/win.mp3'),
      draw: new Audio('sounds/draw.mp3'),
    };
    this.initGame();
  }
  playSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play().catch(e => console.error('проблема со звуком', e));
    }
  }
  initGame() {
    document.querySelectorAll('[data-index]').forEach(block => {
      block.addEventListener('click', () => this.handleClick(block));
    });
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetGame());
    }
    if (this.aiToggle) {
      this.aiToggle.addEventListener('change', () => {
        this.vsAI = this.aiToggle.checked;
        this.resetGame();
      })
    }
  }
  handleClick(block) {
    if (this.gameActive && !block.textContent) {
      const symbol = this.move % 2 === 0 ? this.x : this.o;
      block.textContent = symbol;
      this.gameState[block.dataset.index - 1] = symbol;
      this.checkWin();
      if (this.gameActive == true) {
        this.playSound('click');
      }
      if (this.gameActive) {
        this.move++;
        if (this.player) {
          this.player.textContent = this.move % 2 === 0 ? "X" : "O";
        }
        if (this.vsAI &&this.gameActive && !this.isBoardFull()) {
          setTimeout(() => {this.makeAIMove()}, 500);
        }
      }
      if (this.gameActive == true && !this.gameState.includes('')) {
        document.querySelectorAll('[data-index]').forEach(cell => {
          cell.style.background = "lightgray";
        });
        this.gameActive = false;
        this.playSound('draw');
        this.showResetButton();
      }
    }
  }
  
  makeAIMove() {
    if (!this.gameActive) return;
    
    const aiSymbol = this.x; // ИИ играет за X
    const playerSymbol = this.o; // Игрок играет за O
    
    // 1. Попытка выиграть
    let move = this.findWinningMove(aiSymbol);
    
    // 2. Блокировка игрока
    if (move === null) {
      move = this.findWinningMove(playerSymbol);
    }
    
    // 3. Занять центр, если свободен
    if (move === null && this.gameState[4] === "") {
      move = 4;
    }
    
    // 4. Занять угол, если свободен
    if (move === null) {
      const corners = [0, 2, 6, 8];
      const emptyCorners = corners.filter(index => this.gameState[index] === "");
      if (emptyCorners.length > 0) {
        move = emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
      }
    }
    
    // 5. Случайный ход
    if (move === null) {
      const emptyCells = this.gameState
        .map((cell, index) => cell === "" ? index : null)
        .filter(val => val !== null);
      
      if (emptyCells.length > 0) {
        move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      }
    }
    
    if (move !== null) {
      const block = document.querySelector(`[data-index="${move + 1}"]`);
      block.textContent = aiSymbol;
      this.gameState[move] = aiSymbol;
      this.checkWin();
      
      if (this.gameActive) {
        this.move++;
        if (this.player) {
          this.player.textContent = this.move % 2 === 0 ? "X" : "O";
        }
      }
      
      if (this.gameActive == true && !this.gameState.includes('')) {
        document.querySelectorAll('[data-index]').forEach(cell => {
          cell.style.background = "lightgray";
        });
        this.gameActive = false;
        this.playSound('draw');
        this.showResetButton();
      }
    }
  }

  // Вспомогательный метод для поиска выигрышного хода
  findWinningMove(symbol) {
    for (const pattern of this.winPatterns) {
      const [a, b, c] = pattern;
      // Проверяем, есть ли два символа и пустая клетка в линии
      if (
        (this.gameState[a] === symbol && this.gameState[b] === symbol && this.gameState[c] === "") ||
        (this.gameState[a] === symbol && this.gameState[c] === symbol && this.gameState[b] === "") ||
        (this.gameState[b] === symbol && this.gameState[c] === symbol && this.gameState[a] === "")
      ) {
        // Возвращаем индекс пустой клетки
        if (this.gameState[a] === "") return a;
        if (this.gameState[b] === "") return b;
        if (this.gameState[c] === "") return c;
      }
    }
    return null;
  }

  // Проверка на заполненность поля
  isBoardFull() {
    return !this.gameState.includes("");
  }
  checkWin() {
    for (const pattern of this.winPatterns) {
      const [a, b, c] = pattern;
      if (this.gameState[a] && this.gameState[a] === this.gameState[b] && this.gameState[a] === this.gameState[c]) {
        [a, b, c].forEach(index => {
          document.querySelector(`[data-index="${index + 1}"]`).style.background = "lightgreen";
        });
        this.gameActive = false;
        this.playSound('win');
        this.showResetButton();
        return;
      }
    }
  }
  showResetButton() {
    if (this.resetBtn) {
      this.resetBtn.style.display = 'block';
      setTimeout(() => this.resetBtn.classList.add('visible'), 10);
    }
  }
  resetGame() {
    this.gameState = ["", "", "", "", "", "", "", "", ""];
    this.move = 1;
    this.gameActive = true;
    
    if (this.resetBtn) {
      this.resetBtn.classList.remove('visible');
      setTimeout(() => this.resetBtn.style.display = 'none', 500);
    }
    document.querySelectorAll('[data-index]').forEach(block => {
      block.textContent = "";
      block.style.background = "";
    });
    if (this.player) {
      this.player.textContent = "O";
    }
  }
}

const game = new LogicGame();