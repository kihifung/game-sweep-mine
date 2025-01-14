const Cell = ({ cell, revealCell }) => {
  return (
    <div
      className={`cell ${cell.state}`}
      onClick={() => {
        revealCell(cell.row, cell.col);
      }}
    ></div>
  );
};

export default Cell;
