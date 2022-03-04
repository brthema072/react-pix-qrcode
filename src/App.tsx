import { useState } from 'react'
import './App.css'
import Qrcode from './components/Qrcode'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Qrcode />
    </div>
  )
}

export default App
