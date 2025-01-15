import "./App.css";
import { useState, useEffect } from "react";
import Cell from "./components/Cell";
// 常數
const BOARD_SIZE = 9; // 遊戲的邊長
const NUMBER_OF_MINES = 10; // 幾顆地雷

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
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);

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
          neighborMinesCount: 0,
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
    }
    calculateNeighborMines(newBoard);
    // setBoard(newBoard);
  };
  useEffect(() => {
    initBoard();
  }, []);

  const calculateNeighborMines = (newBoard) => {
    // 透過巢狀迴圈，計算每一格周遭有多少地雷
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const selectedCell = newBoard[row][col];
        if (selectedCell.value === CellValue.MINE) continue;
        let count = 0;

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue;
            const newRow = row + i;
            const newCol = col + j;

            if (
              newRow >= 0 &&
              newRow < BOARD_SIZE &&
              newCol >= 0 &&
              newCol < BOARD_SIZE
            ) {
              if (newBoard[newRow][newCol].value === CellValue.MINE) {
                count++;
              }
            }
          }
        }
        selectedCell.neighborMinesCount = count;
      }
    }
    setBoard(newBoard);
  };

  const revealMines = () => {
    const newBoard = [...board];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        // 如果踩到地雷，就把地雷顯示出來
        if (newBoard[row][col].value === CellValue.MINE) {
          newBoard[row][col].state = CellState.REVEALED;
        }
      }
    }
    setBoard(newBoard);
  };

  //點開格子
  const revealCell = (row, col) => {
    if (gameOver || gameWon) return; // 如果現在的狀態是遊戲結束或是完成遊戲，就不做任何事(不改變格子的狀態)

    const selectedCell = board[row][col];
    if (selectedCell.state !== CellState.HIDDEN) return;
    const newBoard = [...board];
    newBoard[row][col].state = CellState.REVEALED;
    setBoard(newBoard);

    if (selectedCell.value === CellValue.MINE) {
      setGameOver(true);
      revealMines();
    }
    if (
      selectedCell.value === CellValue.EMPTY &&
      selectedCell.neighborMinesCount === 0
    ) {
      revealNeighborsCells(newBoard, row, col);
    }
  };

  const revealNeighborsCells = (newBoard, row, col) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newRow = row + i;
        const newCol = col + j;

        if (
          newRow >= 0 &&
          newRow < BOARD_SIZE &&
          newCol >= 0 &&
          newCol < BOARD_SIZE
        ) {
          const neighborCell = newBoard[newRow][newCol];
          if (neighborCell.state === CellState.HIDDEN) {
            neighborCell.state = CellState.REVEALED;
            //如果掀開之後是空的，就繼續掀開周遭的格子
            if (
              neighborCell.value === CellValue.EMPTY &&
              neighborCell.neighborMinesCount === 0
            ) {
              revealNeighborsCells(newBoard, newRow, newCol);
            }
          }
        }
      }
    }
    setBoard(newBoard);
  };

  const checkIfWin = () => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = board[row][col];
        if (cell.value === CellValue.MINE && cell.state !== CellState.FLAGGED)
          return false;
        if (cell.value !== CellValue.MINE && cell.state !== CellState.REVEALED)
          return false;
      }
    }
    return true;
  };

  useEffect(() => {
    if (board.length > 0) {
      if (checkIfWin()) {
        setGameWon(true);
        // alert("you won!");
      }
    }
  }, [board]);

  const setFlag = (row, col) => {
    if (gameOver || gameWon) return; // 如果現在的狀態是遊戲結束或是完成遊戲，就不做任何事(不改變格子的狀態)
    const newBoard = [...board];
    const selectedCell = newBoard[row][col];
    if (selectedCell.state === CellState.REVEALED) return; // 格子已經被掀開，不做任何事
    selectedCell.state =
      selectedCell.state === CellState.FLAGGED
        ? CellState.HIDDEN
        : CellState.FLAGGED;
    setBoard(newBoard);
  };

  return (
    <div className="App">
      <div className="info">
        <h1>踩地雷</h1>
        <p>
          遊戲範圍：{BOARD_SIZE}x{BOARD_SIZE}={BOARD_SIZE * BOARD_SIZE}
          <br></br>地雷數量：
          {NUMBER_OF_MINES}
        </p>
        <button
          className="restart"
          onClick={() => {
            initBoard(); //重置整個棋盤
            setGameOver(false);
            setGameWon(false);
          }}
        >
          重新開始
        </button>
      </div>
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, colIndex) => (
              <Cell
                cell={cell}
                revealCell={revealCell}
                key={colIndex}
                setFlag={setFlag}
              ></Cell>
            ))}
          </div>
        ))}
        {gameOver && (
          <div className="over">
            <button
              onClick={() => {
                initBoard();
                setGameOver(false);
              }}
            >
              遊戲結束。 <br></br>再來一次？
            </button>
          </div>
        )}
        {gameWon && (
          <div className="over">
            <button
              onClick={() => {
                initBoard();
                setGameOver(false);
                setGameWon(false);
              }}
            >
              你贏了！ <br></br>再一次？
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
