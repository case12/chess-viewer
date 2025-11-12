import { useState, useCallback } from 'react'
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
  // Modes: 'off', 'white', 'black', 'both'
  const [threatMode, setThreatMode] = useState('both')
  const [capturedPieces, setCapturedPieces] = useState([])

  const handleCapturedPiecesChange = useCallback((pieces) => {
    setCapturedPieces(pieces)
  }, [])

  const cycleThreatMode = () => {
    const modes = ['off', 'white', 'black', 'both']
    const currentIndex = modes.indexOf(threatMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setThreatMode(modes[nextIndex])
  }

  const getModeLabel = () => {
    switch (threatMode) {
      case 'off': return 'Threats: Off'
      case 'white': return 'Threats: White Only'
      case 'black': return 'Threats: Black Only'
      case 'both': return 'Threats: Both'
      default: return 'Threats'
    }
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Chess Board Viewer</h1>
          <p className="subtitle">Visualize piece threats and control</p>
        </div>

        <div className="controls">
          <button className={`threat-toggle-btn mode-${threatMode}`} onClick={cycleThreatMode}>
            {getModeLabel()}
          </button>
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
          showWhiteThreats={threatMode === 'white' || threatMode === 'both'}
          showBlackThreats={threatMode === 'black' || threatMode === 'both'}
          onCapturedPiecesChange={handleCapturedPiecesChange}
        />
      </div>
    </div>
  )
}

export default App
