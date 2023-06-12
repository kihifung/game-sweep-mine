/* eslint-disable react/prop-types */

const CellState = {
  HIDDEN: "hidden",
  REVEALED: "revealed",
  FLAGGED: "flagged"
}

const CellValue = {
  MINE: "mine",
  EMPTY: "empty"
}

const Cell = ({ cell, revealCell, setFlag }) => {
  let content
  if (cell.state === CellState.REVEALED) {
    if (cell.value === CellValue.MINE) {
      content = <span className="mine">M</span>
    }
    if (cell.value === CellValue.EMPTY) {
      content = cell.neighborMinesCount > 0 ? cell.neighborMinesCount : ""
    }
  } else if (cell.state === CellState.FLAGGED) {
    content = <span className="flag">&#128681;</span>
  }

  return (
    <div
      className={`cell ${cell.state}`}
      onClick={() => {
        revealCell(cell.row, cell.col)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        setFlag(cell.row, cell.col)
      }}
    >
      {content}
    </div>
  )
}

export default Cell
