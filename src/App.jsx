import "./App.css"
import { useState, useEffect } from "react"
import Cell from "./components/Cell"

// 常數
const BOARD_SIZE = 8
const NUMBER_OF_MINES = 3

const CellState = {
  HIDDEN: "hidden",
  REVEALED: "revealed",
  FLAGGED: "flagged"
}

const CellValue = {
  MINE: "mine",
  EMPTY: "empty"
}

function App() {
  const [board, setBoard] = useState([])
  const [gameWon, setGameWon] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const initBoard = () => {
    const newBoard = []
    for (let row = 0; row < BOARD_SIZE; row++) {
      const newRow = []
      for (let col = 0; col < BOARD_SIZE; col++) {
        newRow.push({
          row,
          col,
          state: CellState.HIDDEN,
          value: CellValue.EMPTY,
          neighborMinesCount: 0
        })
      }
      newBoard.push(newRow)
    }

    // plant mines
    let minesCounts = 0
    while (minesCounts < NUMBER_OF_MINES) {
      const randomRow = Math.floor(Math.random() * BOARD_SIZE)
      const randomCol = Math.floor(Math.random() * BOARD_SIZE)
      const newCell = newBoard[randomRow][randomCol]
      if (newCell.value !== CellValue.MINE) {
        newCell.value = CellValue.MINE
        minesCounts++
      }
    }
    calculateNeighborMines(newBoard)
  }

  useEffect(() => {
    initBoard()
  }, [])

  const calculateNeighborMines = (newBoard) => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const selectedCell = newBoard[row][col]
        if (selectedCell.value === CellValue.MINE) continue
        let count = 0

        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) continue
            const newRow = row + i
            const newCol = col + j

            if (
              newRow >= 0 &&
              newRow < BOARD_SIZE &&
              newCol >= 0 &&
              newCol < BOARD_SIZE
            ) {
              if (newBoard[newRow][newCol].value === CellValue.MINE) {
                count++
              }
            }
          }
        }
        selectedCell.neighborMinesCount = count
      }
    }
    setBoard(newBoard)
  }

  const revealMines = () => {
    const newBoard = [...board]
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (newBoard[row][col].value === CellValue.MINE) {
          newBoard[row][col].state = CellState.REVEALED
        }
      }
    }
    setBoard(newBoard)
  }

  const revealCell = (row, col) => {
    if (gameOver || gameWon) return
    const selectedCell = board[row][col]
    if (selectedCell.state !== CellState.HIDDEN) return
    const newBoard = [...board]
    newBoard[row][col].state = CellState.REVEALED
    setBoard(newBoard)

    if (selectedCell.value === CellValue.MINE) {
      setGameOver(true)
      revealMines()
    }

    if (
      selectedCell.value === CellValue.EMPTY &&
      selectedCell.neighborMinesCount === 0
    ) {
      revealNeighborsCells(newBoard, row, col)
    }
  }

  const revealNeighborsCells = (newBoard, row, col) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const newRow = row + i
        const newCol = col + j
        if (
          newRow >= 0 &&
          newRow < BOARD_SIZE &&
          newCol >= 0 &&
          newCol < BOARD_SIZE
        ) {
          const neighborCell = newBoard[newRow][newCol]
          if (neighborCell.state === CellState.HIDDEN) {
            neighborCell.state = CellState.REVEALED

            if (
              neighborCell.value === CellValue.EMPTY &&
              neighborCell.neighborMinesCount === 0
            ) {
              revealNeighborsCells(newBoard, newRow, newCol)
            }
          }
        }
      }
    }
    setBoard(newBoard)
  }

  const checkIfWin = () => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const cell = board[row][col]
        if (cell.value === CellValue.MINE && cell.state !== CellState.FLAGGED)
          return false
        if (cell.value !== CellValue.MINE && cell.state !== CellState.REVEALED)
          return false
      }
    }
    return true
  }

  useEffect(() => {
    if (board.length > 0) {
      if (checkIfWin()) {
        setGameWon(true)
      }
    }
  }, [board])

  const setFlag = (row, col) => {
    if (gameOver || gameWon) return
    const newBoard = [...board]
    const selectedCell = newBoard[row][col]
    if (selectedCell.state === CellState.REVEALED) return
    selectedCell.state =
      selectedCell.state === CellState.FLAGGED
        ? CellState.HIDDEN
        : CellState.FLAGGED

    setBoard(newBoard)
  }

  return (
    <div className="game-board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, colIndex) => (
            <Cell
              cell={cell}
              revealCell={revealCell}
              key={colIndex}
              setFlag={setFlag}
            />
          ))}
        </div>
      ))}
      {gameOver && (
        <div className="over">
          <button
            onClick={() => {
              initBoard()
              setGameOver(false)
            }}
          >
            你輸了，再試一次？
          </button>
        </div>
      )}
      {gameWon && (
        <div className="over">
          <button
            onClick={() => {
              initBoard()
              setGameOver(false)
              setGameWon(false)
            }}
          >
            你贏了！再一次？
          </button>
        </div>
      )}
    </div>
  )
}

export default App
