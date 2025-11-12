import { useState, useEffect } from 'react'
import './ChessBoard.css'

// Unicode chess pieces
const PIECES = {
  white: {
    king: '♔',
    queen: '♕',
    rook: '♖',
    bishop: '♗',
    knight: '♘',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
}

// Initial chess board setup
const INITIAL_BOARD = [
  // Row 8 (index 0)
  { piece: 'rook', color: 'black' },
  { piece: 'knight', color: 'black' },
  { piece: 'bishop', color: 'black' },
  { piece: 'queen', color: 'black' },
  { piece: 'king', color: 'black' },
  { piece: 'bishop', color: 'black' },
  { piece: 'knight', color: 'black' },
  { piece: 'rook', color: 'black' },
  // Row 7 (index 8-15)
  ...Array(8).fill({ piece: 'pawn', color: 'black' }),
  // Rows 6-3 (index 16-47) - empty
  ...Array(32).fill(null),
  // Row 2 (index 48-55)
  ...Array(8).fill({ piece: 'pawn', color: 'white' }),
  // Row 1 (index 56-63)
  { piece: 'rook', color: 'white' },
  { piece: 'knight', color: 'white' },
  { piece: 'bishop', color: 'white' },
  { piece: 'queen', color: 'white' },
  { piece: 'king', color: 'white' },
  { piece: 'bishop', color: 'white' },
  { piece: 'knight', color: 'white' },
  { piece: 'rook', color: 'white' },
]

// Piece importance for line thickness
const PIECE_WEIGHT = {
  pawn: 1,
  knight: 2,
  bishop: 2,
  rook: 3,
  queen: 4,
  king: 1
}

function ChessBoard({ showWhiteThreats, showBlackThreats }) {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [draggedPiece, setDraggedPiece] = useState(null)
  const [threats, setThreats] = useState([])

  // Calculate all threats whenever board changes
  useEffect(() => {
    const allThreats = []
    board.forEach((piece, index) => {
      if (piece) {
        const threatened = getThreatenedSquares(index, piece, board)
        threatened.forEach(targetIndex => {
          allThreats.push({
            from: index,
            to: targetIndex,
            color: piece.color,
            piece: piece.piece
          })
        })
      }
    })
    setThreats(allThreats)
  }, [board])

  // Get threatened squares for a piece at a given position
  function getThreatenedSquares(index, piece, currentBoard) {
    const row = Math.floor(index / 8)
    const col = index % 8
    const threatened = []

    switch (piece.piece) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1
        // Pawn attacks diagonally (only show if can capture or square is empty)
        const attackCols = [col - 1, col + 1]
        attackCols.forEach(c => {
          if (c >= 0 && c < 8) {
            const targetRow = row + direction
            if (targetRow >= 0 && targetRow < 8) {
              const targetIndex = targetRow * 8 + c
              const targetPiece = currentBoard[targetIndex]
              // Only show if empty or enemy piece
              if (!targetPiece || targetPiece.color !== piece.color) {
                threatened.push(targetIndex)
              }
            }
          }
        })
        break

      case 'knight':
        const knightMoves = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1]
        ]
        knightMoves.forEach(([dr, dc]) => {
          const newRow = row + dr
          const newCol = col + dc
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetIndex = newRow * 8 + newCol
            const targetPiece = currentBoard[targetIndex]
            // Only show if empty or enemy piece
            if (!targetPiece || targetPiece.color !== piece.color) {
              threatened.push(targetIndex)
            }
          }
        })
        break

      case 'bishop':
        addSlidingMoves(row, col, [[1, 1], [1, -1], [-1, 1], [-1, -1]], currentBoard, threatened, piece.color)
        break

      case 'rook':
        addSlidingMoves(row, col, [[1, 0], [-1, 0], [0, 1], [0, -1]], currentBoard, threatened, piece.color)
        break

      case 'queen':
        addSlidingMoves(row, col, [
          [1, 0], [-1, 0], [0, 1], [0, -1],
          [1, 1], [1, -1], [-1, 1], [-1, -1]
        ], currentBoard, threatened, piece.color)
        break

      case 'king':
        const kingMoves = [
          [-1, -1], [-1, 0], [-1, 1],
          [0, -1], [0, 1],
          [1, -1], [1, 0], [1, 1]
        ]
        kingMoves.forEach(([dr, dc]) => {
          const newRow = row + dr
          const newCol = col + dc
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
            const targetIndex = newRow * 8 + newCol
            const targetPiece = currentBoard[targetIndex]
            // Only show if empty or enemy piece
            if (!targetPiece || targetPiece.color !== piece.color) {
              threatened.push(targetIndex)
            }
          }
        })
        break
    }

    return threatened
  }

  // Helper for sliding pieces (bishop, rook, queen)
  function addSlidingMoves(row, col, directions, currentBoard, threatened, pieceColor) {
    directions.forEach(([dr, dc]) => {
      let newRow = row + dr
      let newCol = col + dc
      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetIndex = newRow * 8 + newCol
        const targetPiece = currentBoard[targetIndex]

        // Stop before friendly pieces
        if (targetPiece && targetPiece.color === pieceColor) {
          break
        }

        // Add empty squares and enemy pieces
        threatened.push(targetIndex)

        // Stop after enemy pieces
        if (targetPiece && targetPiece.color !== pieceColor) {
          break
        }

        newRow += dr
        newCol += dc
      }
    })
  }

  // Drag and drop handlers
  function handleDragStart(e, index) {
    setDraggedPiece(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragOver(e) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  function handleDrop(e, targetIndex) {
    e.preventDefault()
    if (draggedPiece !== null) {
      const newBoard = [...board]
      newBoard[targetIndex] = board[draggedPiece]
      newBoard[draggedPiece] = null
      setBoard(newBoard)
      setDraggedPiece(null)
    }
  }

  // Get center coordinates of a square for drawing lines
  function getSquareCenter(index) {
    const row = Math.floor(index / 8)
    const col = index % 8
    const squareSize = 80 // Must match CSS
    return {
      x: col * squareSize + squareSize / 2,
      y: row * squareSize + squareSize / 2
    }
  }

  // Filter threats based on toggle settings
  const visibleThreats = threats.filter(threat => {
    if (threat.color === 'white') return showWhiteThreats
    if (threat.color === 'black') return showBlackThreats
    return false
  })

  return (
    <div className="chess-board-container">
      <svg className="threat-lines" width="640" height="640">
        {visibleThreats.map((threat, i) => {
          const from = getSquareCenter(threat.from)
          const to = getSquareCenter(threat.to)
          const weight = PIECE_WEIGHT[threat.piece]
          const strokeWidth = weight * 0.8
          const opacity = 0.3 + (weight * 0.15)

          return (
            <line
              key={`${threat.from}-${threat.to}-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={threat.color === 'white' ? 'rgba(100, 180, 255, 0.9)' : 'rgba(255, 80, 80, 0.9)'}
              strokeWidth={strokeWidth}
              opacity={opacity}
              className="threat-line"
            />
          )
        })}
      </svg>

      <div className="chess-board">
        {board.map((square, index) => {
          const row = Math.floor(index / 8)
          const col = index % 8
          const isLight = (row + col) % 2 === 0

          return (
            <div
              key={index}
              className={`square ${isLight ? 'light' : 'dark'}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              {square && (
                <div
                  className={`piece ${square.color}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                >
                  {PIECES[square.color][square.piece]}
                </div>
              )}
              {/* Show coordinates on edge squares */}
              {col === 0 && (
                <span className="coord-label row-label">{8 - row}</span>
              )}
              {row === 7 && (
                <span className="coord-label col-label">
                  {String.fromCharCode(97 + col)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ChessBoard
