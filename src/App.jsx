import "./App.css";

// 常數
const BOARD_SIZE = 8;
const NUMBER_OF_MINES = 3;

const CellState = {
  HIDDEN: "hidden",
  REVEALED: "revealed",
  FLAGGED: "flagged",
};

const CellValue = {
  MINE: "mine",
  EMPTY: "empty",
};

function App() {
  return <div className="game-board"></div>;
}

export default App;
