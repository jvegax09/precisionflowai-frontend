import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  const [signals, setSignals] = useState([])

  useEffect(() => {
    fetchSignals()

    const interval = setInterval(() => {
      fetchSignals()
    }, 5000) // refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  async function fetchSignals() {
    const { data, error } = await supabase
      .from('signals')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching signals:', error)
    } else {
      setSignals(data)
    }
  }

  return (
    <div className="App">
      <h1>Precision Flow AI</h1>
      <p>Live Signal Feed</p>
      <table>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Platform</th>
            <th>Type</th>
            <th>Symbol</th>
            <th>Direction</th>
            <th>Strategy</th>
            <th>Confidence</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {signals.map((signal, idx) => (
            <tr key={idx}>
              <td>{new Date(signal.timestamp).toLocaleTimeString()}</td>
              <td>{signal.platform}</td>
              <td>{signal.type}</td>
              <td>{signal.symbol}</td>
              <td>{signal.direction}</td>
              <td>{signal.strategy}</td>
              <td>{signal.confidence}</td>
              <td>{signal.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
