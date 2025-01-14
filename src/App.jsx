import "./App.css";
import { useState, useEffect } from "react";

// 常數
const BOARD_SIZE = 8; // 遊戲的邊長
const NUMBER_OF_MINES = 15; // 幾顆地雷

// 定義 "每一格" 的狀態
const CellState = {
  HIDDEN: "hidden", // 隱藏
  REVEALED: "revealed", //揭開
  FLAGGED: "flagged", // 插旗/標示
};
// 定義 "每一格" 的真實狀態(有沒有地雷)
const CellValue = {
  MINE: "mine",
  EMPTY: "empty",
};

function App() {
  const [board, setBoard] = useState([]); // 遊戲版

  // 初始化遊戲版
  const initBoard = () => {
    const newBoard = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      const newRow = [];
      for (let col = 0; col < BOARD_SIZE; col++) {
        newRow.push({
          row,
          col,
          state: CellState.HIDDEN,
          value: CellValue.EMPTY,
          // 顯示的數字：周遭有多少地雷
        });
      }
      newBoard.push(newRow);
    }

    // 初始化地雷
    let minesCounts = 0;
    while (minesCounts < NUMBER_OF_MINES) {
      const randomRow = Math.floor(Math.random() * BOARD_SIZE);
      const randomCol = Math.floor(Math.random() * BOARD_SIZE);
      const newCell = newBoard[randomRow][randomCol];
      // 如果格子沒有地雷才種地雷
      if (newCell.value !== CellValue.MINE) {
        newCell.value = CellValue.MINE;
        minesCounts++;
      }
      console.log(newBoard);
      setBoard(newBoard);
    }
  };
  useEffect(() => {
    initBoard();
  }, []);

  const revealCell = (row, col) => {
    const selectedCell = board[row][col];
    if (selectedCell.state !== CellState.HIDDEN) return;
    const newBoard = [...board];
    newBoard[row][col].state = CellState.REVEALED;

    setBoard(newBoard);
  };

  return (
    <div className="App">
      <h1>踩地雷</h1>
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <div
                className={`cell ${cell.state}`}
                key={colIndex}
                onClick={() => {
                  revealCell(rowIndex, colIndex);
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
