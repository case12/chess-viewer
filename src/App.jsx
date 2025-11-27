import { useState, useCallback, useEffect } from 'react'
import ChessBoard from './components/ChessBoard'
import './App.css'

// Unicode chess pieces
const PIECE_SYMBOLS = {
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

function App() {
  // Load initial states from localStorage or use defaults
  const [showWhiteThreats, setShowWhiteThreats] = useState(() => {
    const saved = localStorage.getItem('showWhiteThreats')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [showBlackThreats, setShowBlackThreats] = useState(() => {
    const saved = localStorage.getItem('showBlackThreats')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [capturedPieces, setCapturedPieces] = useState([])
  const [showHighlights, setShowHighlights] = useState(() => {
    const saved = localStorage.getItem('showHighlights')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [showHeatMap, setShowHeatMap] = useState(() => {
    const saved = localStorage.getItem('showHeatMap')
    return saved !== null ? JSON.parse(saved) : true
  })
  const [showEmptySquareThreats, setShowEmptySquareThreats] = useState(() => {
    const saved = localStorage.getItem('showEmptySquareThreats')
    return saved !== null ? JSON.parse(saved) : true
  })

  // Save to localStorage whenever states change
  useEffect(() => {
    localStorage.setItem('showWhiteThreats', JSON.stringify(showWhiteThreats))
  }, [showWhiteThreats])

  useEffect(() => {
    localStorage.setItem('showBlackThreats', JSON.stringify(showBlackThreats))
  }, [showBlackThreats])

  useEffect(() => {
    localStorage.setItem('showHighlights', JSON.stringify(showHighlights))
  }, [showHighlights])

  useEffect(() => {
    localStorage.setItem('showHeatMap', JSON.stringify(showHeatMap))
  }, [showHeatMap])

  useEffect(() => {
    localStorage.setItem('showEmptySquareThreats', JSON.stringify(showEmptySquareThreats))
  }, [showEmptySquareThreats])

  const handleCapturedPiecesChange = useCallback((pieces) => {
    setCapturedPieces(pieces)
  }, [])

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Chess Board Viewer</h1>
          <p className="subtitle">Visualize piece threats and control</p>
        </div>

        <div className="controls">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showWhiteThreats}
              onChange={(e) => setShowWhiteThreats(e.target.checked)}
            />
            Show white threats
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showBlackThreats}
              onChange={(e) => setShowBlackThreats(e.target.checked)}
            />
            Show black threats
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showHighlights}
              onChange={(e) => setShowHighlights(e.target.checked)}
            />
            Show piece highlights
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showEmptySquareThreats}
              onChange={(e) => setShowEmptySquareThreats(e.target.checked)}
            />
            Show empty square threats
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showHeatMap}
              onChange={(e) => setShowHeatMap(e.target.checked)}
            />
            Show threat heat map
          </label>
        </div>

        <div className="captured-pieces">
          <h3>Available Pieces</h3>
          {capturedPieces.length === 0 ? (
            <p className="no-pieces">All pieces are on the board</p>
          ) : (
            <div className="pieces-list">
              {capturedPieces.map((p, i) => (
                <div
                  key={i}
                  className={`captured-piece ${p.color}`}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('piece', JSON.stringify(p))
                    e.dataTransfer.effectAllowed = 'copy'
                  }}
                >
                  {PIECE_SYMBOLS[p.color][p.piece]}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="board-area">
        <ChessBoard
          showWhiteThreats={showWhiteThreats}
          showBlackThreats={showBlackThreats}
          showHighlights={showHighlights}
          showEmptySquareThreats={showEmptySquareThreats}
          showHeatMap={showHeatMap}
          onCapturedPiecesChange={handleCapturedPiecesChange}
        />
      </div>
    </div>
  )
}

export default App
