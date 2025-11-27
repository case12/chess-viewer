import { useState, useEffect } from 'react'
import './ChessBoard.css'

// Unicode chess pieces (using filled symbols for both, color controlled by CSS)
const PIECES = {
  white: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
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

// Famous chess positions
const POSITIONS = {
  starting: {
    name: "Starting Position",
    board: [
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
  },
  italian: {
    name: "Italian Game Opening",
    board: [
      { piece: 'rook', color: 'black' }, null, { piece: 'bishop', color: 'black' }, { piece: 'queen', color: 'black' }, { piece: 'king', color: 'black' }, { piece: 'bishop', color: 'black' }, null, { piece: 'rook', color: 'black' },
      { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, null, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' },
      null, null, { piece: 'knight', color: 'black' }, null, null, { piece: 'knight', color: 'black' }, null, null,
      null, null, null, null, { piece: 'pawn', color: 'black' }, null, null, null,
      null, null, { piece: 'bishop', color: 'white' }, null, { piece: 'pawn', color: 'white' }, null, null, null,
      null, null, null, null, null, { piece: 'knight', color: 'white' }, null, null,
      { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, null, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' },
      { piece: 'rook', color: 'white' }, { piece: 'knight', color: 'white' }, { piece: 'bishop', color: 'white' }, { piece: 'queen', color: 'white' }, { piece: 'king', color: 'white' }, null, null, { piece: 'rook', color: 'white' },
    ]
  },
  scholarsMate: {
    name: "Scholar's Mate",
    board: [
      { piece: 'rook', color: 'black' }, { piece: 'knight', color: 'black' }, { piece: 'bishop', color: 'black' }, null, { piece: 'king', color: 'black' }, { piece: 'bishop', color: 'black' }, { piece: 'knight', color: 'black' }, { piece: 'rook', color: 'black' },
      { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, null, null, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' },
      null, null, null, null, { piece: 'pawn', color: 'black' }, null, null, null,
      null, null, null, { piece: 'pawn', color: 'black' }, null, null, null, null,
      null, null, { piece: 'bishop', color: 'white' }, null, { piece: 'pawn', color: 'white' }, null, { piece: 'queen', color: 'white' }, null,
      null, null, null, null, null, { piece: 'knight', color: 'white' }, null, null,
      { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, null, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' },
      { piece: 'rook', color: 'white' }, { piece: 'knight', color: 'white' }, { piece: 'bishop', color: 'white' }, null, { piece: 'king', color: 'white' }, null, null, { piece: 'rook', color: 'white' },
    ]
  },
  endgame: {
    name: "Rook Endgame",
    board: [
      null, null, null, null, null, null, { piece: 'king', color: 'black' }, null,
      null, null, null, null, null, null, null, { piece: 'pawn', color: 'black' },
      null, null, null, null, null, { piece: 'pawn', color: 'black' }, null, null,
      null, null, null, { piece: 'rook', color: 'white' }, null, null, null, null,
      null, null, null, null, null, null, { piece: 'pawn', color: 'white' }, null,
      null, null, null, null, null, null, null, null,
      null, null, null, null, { piece: 'king', color: 'white' }, null, null, null,
      null, null, null, { piece: 'rook', color: 'black' }, null, null, null, null,
    ]
  },
  tactics: {
    name: "Tactical Position",
    board: [
      { piece: 'rook', color: 'black' }, null, null, null, { piece: 'king', color: 'black' }, null, null, { piece: 'rook', color: 'black' },
      { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, null, null, null, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'black' },
      null, null, { piece: 'pawn', color: 'black' }, null, null, { piece: 'knight', color: 'black' }, null, null,
      null, null, { piece: 'bishop', color: 'white' }, { piece: 'pawn', color: 'black' }, { piece: 'pawn', color: 'white' }, null, null, null,
      null, null, { piece: 'bishop', color: 'black' }, { piece: 'pawn', color: 'white' }, null, null, null, null,
      null, null, { piece: 'knight', color: 'white' }, null, null, { piece: 'knight', color: 'white' }, null, null,
      { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, null, null, null, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' }, { piece: 'pawn', color: 'white' },
      { piece: 'rook', color: 'white' }, null, null, { piece: 'queen', color: 'white' }, null, { piece: 'rook', color: 'white' }, { piece: 'king', color: 'white' }, null,
    ]
  }
}

// Initial chess board setup
const INITIAL_BOARD = POSITIONS.starting.board

// Piece importance for line thickness
const PIECE_WEIGHT = {
  pawn: 1,
  knight: 2,
  bishop: 2,
  rook: 3,
  queen: 4,
  king: 1
}

// Full set of pieces for each color
const FULL_PIECE_SET = {
  white: [
    { piece: 'king', count: 1 },
    { piece: 'queen', count: 1 },
    { piece: 'rook', count: 2 },
    { piece: 'bishop', count: 2 },
    { piece: 'knight', count: 2 },
    { piece: 'pawn', count: 8 }
  ],
  black: [
    { piece: 'king', count: 1 },
    { piece: 'queen', count: 1 },
    { piece: 'rook', count: 2 },
    { piece: 'bishop', count: 2 },
    { piece: 'knight', count: 2 },
    { piece: 'pawn', count: 8 }
  ]
}

function ChessBoard({ showWhiteThreats, showBlackThreats, showHighlights, showHeatMap, onCapturedPiecesChange }) {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [draggedPiece, setDraggedPiece] = useState(null)
  const [draggedFromCaptures, setDraggedFromCaptures] = useState(null)
  const [threats, setThreats] = useState([])
  const [selectedPosition, setSelectedPosition] = useState('starting')
  const [hoveredSquare, setHoveredSquare] = useState(null)
  const [flipped, setFlipped] = useState(false)

  // Load a preset position
  const loadPosition = (positionKey) => {
    setSelectedPosition(positionKey)
    setBoard([...POSITIONS[positionKey].board])
  }

  // Calculate captured/missing pieces
  useEffect(() => {
    const piecesOnBoard = { white: {}, black: {} }

    // Count pieces on board
    board.forEach(square => {
      if (square) {
        const { color, piece } = square
        piecesOnBoard[color][piece] = (piecesOnBoard[color][piece] || 0) + 1
      }
    })

    // Calculate missing pieces
    const capturedPieces = []

    if (FULL_PIECE_SET) {
      ['white', 'black'].forEach(color => {
        const pieceSet = FULL_PIECE_SET[color]
        if (pieceSet) {
          pieceSet.forEach(({ piece, count }) => {
            const onBoard = piecesOnBoard[color][piece] || 0
            const missing = count - onBoard
            for (let i = 0; i < missing; i++) {
              capturedPieces.push({ piece, color })
            }
          })
        }
      })
    }

    if (onCapturedPiecesChange) {
      onCapturedPiecesChange(capturedPieces)
    }
  }, [board, onCapturedPiecesChange])

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
        // Also add defended squares (where friendly pieces control)
        const defended = getDefendedSquares(index, piece, board)
        defended.forEach(targetIndex => {
          allThreats.push({
            from: index,
            to: targetIndex,
            color: piece.color,
            piece: piece.piece,
            isDefense: true
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

  // Helper for sliding pieces - defense (includes friendly pieces only)
  function addSlidingDefense(row, col, directions, currentBoard, defended, pieceColor) {
    directions.forEach(([dr, dc]) => {
      let newRow = row + dr
      let newCol = col + dc
      while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const targetIndex = newRow * 8 + newCol
        const targetPiece = currentBoard[targetIndex]

        // Only add friendly pieces (defended)
        if (targetPiece && targetPiece.color === pieceColor) {
          defended.push(targetIndex)
        }

        // Stop if there's any piece
        if (targetPiece) {
          break
        }

        newRow += dr
        newCol += dc
      }
    })
  }

  // Get defended/controlled squares (includes friendly pieces)
  function getDefendedSquares(index, piece, currentBoard) {
    const row = Math.floor(index / 8)
    const col = index % 8
    const defended = []

    switch (piece.piece) {
      case 'pawn':
        const direction = piece.color === 'white' ? -1 : 1
        // Pawn defends diagonally
        const attackCols = [col - 1, col + 1]
        attackCols.forEach(c => {
          if (c >= 0 && c < 8) {
            const targetRow = row + direction
            if (targetRow >= 0 && targetRow < 8) {
              const targetIndex = targetRow * 8 + c
              const targetPiece = currentBoard[targetIndex]
              // Only include friendly pieces
              if (targetPiece && targetPiece.color === piece.color) {
                defended.push(targetIndex)
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
            // Only include friendly pieces
            if (targetPiece && targetPiece.color === piece.color) {
              defended.push(targetIndex)
            }
          }
        })
        break

      case 'bishop':
        addSlidingDefense(row, col, [[1, 1], [1, -1], [-1, 1], [-1, -1]], currentBoard, defended, piece.color)
        break

      case 'rook':
        addSlidingDefense(row, col, [[1, 0], [-1, 0], [0, 1], [0, -1]], currentBoard, defended, piece.color)
        break

      case 'queen':
        addSlidingDefense(row, col, [
          [1, 0], [-1, 0], [0, 1], [0, -1],
          [1, 1], [1, -1], [-1, 1], [-1, -1]
        ], currentBoard, defended, piece.color)
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
            // Only include friendly pieces
            if (targetPiece && targetPiece.color === piece.color) {
              defended.push(targetIndex)
            }
          }
        })
        break
    }

    return defended
  }

  // Drag and drop handlers
  function handleDragStart(e, index) {
    setDraggedPiece(index)
    setDraggedFromCaptures(null)
    e.dataTransfer.effectAllowed = 'move'
  }

  function handleDragStartFromCaptures(e, piece, color) {
    setDraggedFromCaptures({ piece, color })
    setDraggedPiece(null)
    e.dataTransfer.effectAllowed = 'copy'
  }

  function handleDragOver(e) {
    e.preventDefault()
    // Use 'move' for board pieces, 'copy' for sidebar pieces
    if (draggedPiece !== null) {
      e.dataTransfer.dropEffect = 'move'
    } else {
      e.dataTransfer.dropEffect = 'copy'
    }
  }

  function handleDrop(e, targetIndex) {
    e.preventDefault()

    // Check if dropping from sidebar (captured pieces)
    const pieceData = e.dataTransfer.getData('piece')
    if (pieceData) {
      try {
        const piece = JSON.parse(pieceData)
        const newBoard = [...board]
        newBoard[targetIndex] = piece
        setBoard(newBoard)
        return
      } catch (err) {
        console.error('Failed to parse piece data:', err)
      }
    }

    // Dropping from captured pieces (internal state)
    if (draggedFromCaptures) {
      const newBoard = [...board]
      newBoard[targetIndex] = { ...draggedFromCaptures }
      setBoard(newBoard)
      setDraggedFromCaptures(null)
      return
    }

    // Dropping from board
    if (draggedPiece !== null) {
      // Don't do anything if dropping on the same square
      if (draggedPiece === targetIndex) {
        setDraggedPiece(null)
        return
      }

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

  // Filter threats based on toggle settings and group by target square
  const visibleThreats = threats.filter(threat => {
    if (threat.color === 'white') return showWhiteThreats
    if (threat.color === 'black') return showBlackThreats
    return false
  })

  // Group threats by target square (for display)
  const threatsBySquare = {}
  visibleThreats.forEach(threat => {
    if (!threatsBySquare[threat.to]) {
      threatsBySquare[threat.to] = []
    }
    threatsBySquare[threat.to].push(threat)
  })

  // Group ALL threats by target square (for hover highlighting - ignores filters)
  const allThreatsBySquare = {}
  threats.forEach(threat => {
    if (!allThreatsBySquare[threat.to]) {
      allThreatsBySquare[threat.to] = []
    }
    allThreatsBySquare[threat.to].push(threat)
  })

  // Get pieces threatening the hovered square (use all threats, not filtered)
  const threateningPieces = hoveredSquare !== null
    ? (allThreatsBySquare[hoveredSquare] || []).map(t => t.from)
    : []

  return (
    <div className="chess-viewer-wrapper">
      <div className="position-selector">
        <label htmlFor="position-select">Select Position:</label>
        <select
          id="position-select"
          value={selectedPosition}
          onChange={(e) => loadPosition(e.target.value)}
          className="position-dropdown"
        >
          {Object.entries(POSITIONS).map(([key, position]) => (
            <option key={key} value={key}>{position.name}</option>
          ))}
        </select>
        <button
          onClick={() => setFlipped(!flipped)}
          className="flip-button"
          title="Flip board"
        >
          ⇅
        </button>
      </div>

      <div className="chess-board-container">

      <div className={`chess-board ${flipped ? 'flipped' : ''}`}>
        {board.map((square, index) => {
          const row = Math.floor(index / 8)
          const col = index % 8
          const isLight = (row + col) % 2 === 0
          const threatsToThisSquare = threatsBySquare[index] || []
          const allThreatsToThisSquare = allThreatsBySquare[index] || []

          return (
            <div
              key={index}
              className={`square ${isLight ? 'light' : 'dark'}`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onMouseEnter={() => setHoveredSquare(index)}
              onMouseLeave={() => setHoveredSquare(null)}
            >
              {/* Threat heat map overlay */}
              {showHeatMap && threatsToThisSquare.length > 0 && (
                <div
                  className="threat-overlay"
                  style={{
                    opacity: Math.min(threatsToThisSquare.length * 0.25, 0.85)
                  }}
                />
              )}

              {/* Threat and defense indicators */}
              {showHighlights && (threatsToThisSquare.length > 0 || (square && threatsToThisSquare.some(t => t.color !== square.color))) && (
                <div className="explosion-indicators">
                  {/* Show attack indicators */}
                  {threatsToThisSquare.map((threat, i) => {
                    // Skip if this is a friendly piece on this square (defender indicators shown separately)
                    if (square && threat.color === square.color) {
                      return null;
                    }
                    // Check if this square has a piece that's being threatened by opposite color
                    const isCaptureThreat = square && square.color !== threat.color
                    // Use bullseye for captures, mini piece for empty squares
                    if (isCaptureThreat) {
                      return (
                        <span key={`threat-${i}`} className="explosion">
                          🎯
                        </span>
                      )
                    } else {
                      // Show mini version of the threatening piece for empty squares
                      const pieceSymbol = PIECES[threat.color][threat.piece]
                      return (
                        <span key={`threat-${i}`} className={`explosion mini-piece ${threat.color}`}>
                          {pieceSymbol}
                        </span>
                      )
                    }
                  })}
                  {/* Show shields for defenders if piece is under attack */}
                  {square && threatsToThisSquare.some(t => t.color !== square.color) && (() => {
                    const defenders = threatsToThisSquare.filter(t => t.color === square.color);
                    if (defenders.length > 0) {
                      console.log(`Square ${index} (${square.piece} ${square.color}): ${defenders.length} defenders`);
                    }
                    return defenders.map((defender, i) => (
                      <span key={`shield-${i}`} className="explosion">
                        🛡️
                      </span>
                    ));
                  })()}
                </div>
              )}

              {square && (
                <div
                  className={`piece ${square.color} ${square.piece === 'king' ? 'king-piece' : ''} ${square.piece === 'queen' ? 'queen-piece' : ''} ${square.piece === 'bishop' ? 'bishop-piece' : ''} ${square.piece === 'knight' ? 'knight-piece' : ''} ${threateningPieces.includes(index) ? 'threatening' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                >
                  {PIECES[square.color][square.piece]}
                </div>
              )}
              {/* Show coordinates on edge squares */}
              {(flipped ? col === 7 : col === 0) && (
                <span className="coord-label row-label">{8 - row}</span>
              )}
              {(flipped ? row === 0 : row === 7) && (
                <span className="coord-label col-label">
                  {String.fromCharCode(97 + col)}
                </span>
              )}
            </div>
          )
        })}
      </div>
    </div>
    </div>
  )
}

export default ChessBoard
