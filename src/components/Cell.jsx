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

const Cell = ({ cell, revealCell, setFlag }) => {
  let content;
  if (cell.state === CellState.REVEALED) {
    if (cell.value === CellValue.MINE) {
      content = (
        <span className="mine">
          {/* M */}
          <img src="/land-mine.png" alt="mine/bomb" className="mine-image" />
        </span>
      ); // 翻開之後發現是地雷
    }
    if (cell.value === CellValue.EMPTY) {
      // 判斷周遭是空的還是有地雷(這個上面是否會顯示數字)
      content = cell.neighborMinesCount > 0 ? cell.neighborMinesCount : "";
    }
  } else if (cell.state === CellState.FLAGGED) {
    content = <span className="flag">&#128681;</span>; // 如果格子有被標示，就要顯示旗子
  }
  // const leftClick = () => {

  // };
  //const rightClick = () => {};

  return (
    <div
      className={`cell ${cell.state}`}
      onClick={() => {
        revealCell(cell.row, cell.col);
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setFlag(cell.row, cell.col);
      }}
    >
      {content}
    </div>
  );
};

export default Cell;
