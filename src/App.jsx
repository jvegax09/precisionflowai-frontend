import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [signals, setSignals] = useState([]);
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);

  useEffect(() => {
    const fetchSignals = async () => {
      try {
        const response = await axios.get('https://waolvlckinxsgtxzsiul.supabase.co/rest/v1/signals?select=*', {
          headers: {
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c2d0enNpdWwiLCJpYXQiOjE3MTA4MjU5NzgsImV4cCI6MjAyMjQwMTk3OH0.4nH7Y9mPIkUwsc5VaBqNSMCC5FhKcmVKH40avwI0VRo',
          }
        });
        setSignals(response.data.reverse());
      } catch (error) {
        console.error('Error fetching signals:', error);
      }
    };

    fetchSignals();
    const interval = setInterval(fetchSignals, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <div className="header">
        <h1>Precision Flow AI</h1>
      </div>

      <div className="toggle-group">
        <label>
          <input type="checkbox" checked={autoIBKR} onChange={() => setAutoIBKR(!autoIBKR)} />
          Auto Mode (IBKR)
        </label>
        <label>
          <input type="checkbox" checked={autoOANDA} onChange={() => setAutoOANDA(!autoOANDA)} />
          Auto Mode (OANDA)
        </label>
      </div>

      {signals.map((signal, index) => (
        <div className="trade-card" key={index}>
          <h3>{signal.symbol} - {signal.direction.toUpperCase()}</h3>
          <p>Type: {signal.type} | Platform: {signal.platform}</p>
          <p>Strategy: {signal.strategy} | Confidence: {signal.confidence}%</p>
          <p>Notes: {signal.notes}</p>
          <p>Timestamp: {new Date(signal.timestamp).toLocaleString()}</p>
          <div className="confidence-bar">
            <div
              className="confidence-bar-inner"
              style={{ width: `${signal.confidence}%` }}
            />
          </div>
        </div>
      ))}

      <div className="footer">
        Powered by Precision Flow AI – Live Signal Feed
      </div>
    </div>
  );
}

export default App;
