import { useState } from 'react'
import ChessBoard from './components/ChessBoard'
import './App.css'

function App() {
  const [showWhiteThreats, setShowWhiteThreats] = useState(true)
  const [showBlackThreats, setShowBlackThreats] = useState(true)

  return (
    <div className="app">
      <h1>Chess Board Viewer</h1>
      <p className="subtitle">Visualize piece threats and control</p>

      <div className="controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={showWhiteThreats}
            onChange={(e) => setShowWhiteThreats(e.target.checked)}
          />
          <span>Show White Threats</span>
        </label>
        <label className="toggle">
          <input
            type="checkbox"
            checked={showBlackThreats}
            onChange={(e) => setShowBlackThreats(e.target.checked)}
          />
          <span>Show Black Threats</span>
        </label>
      </div>

      <ChessBoard
        showWhiteThreats={showWhiteThreats}
        showBlackThreats={showBlackThreats}
      />

      <div className="instructions">
        <h3>How to use:</h3>
        <ul>
          <li>Drag and drop pieces to move them anywhere on the board</li>
          <li>Lines show which squares each piece is threatening</li>
          <li>Line thickness indicates piece importance (Queen &gt; Rook &gt; Bishop/Knight &gt; Pawn)</li>
          <li>Toggle white/black threat lines using the controls above</li>
        </ul>
      </div>
    </div>
  )
}

export default App
