import { useState } from 'react'
import ChessBoard from './components/ChessBoard'
import './App.css'

function App() {
  // Modes: 'off', 'white', 'black', 'both'
  const [threatMode, setThreatMode] = useState('both')

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

        <div className="instructions">
          <h3>How to use:</h3>
          <ul>
            <li>Drag and drop pieces to move them anywhere on the board</li>
            <li>Red overlay shows threatened squares - darker means more threats</li>
            <li>💥 emojis show the number of pieces attacking each square</li>
            <li>Click the button above to toggle threat visualization</li>
          </ul>
        </div>
      </div>

      <div className="board-area">
        <ChessBoard
          showWhiteThreats={threatMode === 'white' || threatMode === 'both'}
          showBlackThreats={threatMode === 'black' || threatMode === 'both'}
        />
      </div>
    </div>
  )
}

export default App
