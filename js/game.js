class BodyGame {
  constructor() {
    this.x = 'X';
    this.o = 'O';
    this.move = 1;
    this.gameActive = true;
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
    
    this.initGame();
  }
  initGame() {
    document.querySelectorAll('[data-index]').forEach(block => {
      block.addEventListener('click', () => this.handleClick(block));
    });
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetGame());
    }
  }
  handleClick(block) {
    if (this.gameActive && !block.textContent) {
      const symbol = this.move % 2 === 0 ? this.x : this.o;
      block.textContent = symbol;
      this.gameState[block.dataset.index - 1] = symbol;
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
        this.showResetButton();
      }
    }
  }
  checkWin() {
    for (const pattern of this.winPatterns) {
      const [a, b, c] = pattern;
      if (this.gameState[a] && this.gameState[a] === this.gameState[b] && this.gameState[a] === this.gameState[c]) {
        document.querySelector(`[data-index="${a + 1}"]`).style.background = "lightgreen";
        document.querySelector(`[data-index="${b + 1}"]`).style.background = "lightgreen";
        document.querySelector(`[data-index="${c + 1}"]`).style.background = "lightgreen";
        this.gameActive = false;
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