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
        const response = await axios.get(
          'https://waolvlckinxsgtxzsiul.supabase.co/rest/v1/signals?select=*',
          {
            headers: {
              apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c2d0enNpdWwiLCJpYXQiOjE3MTA4MjU5NzgsImV4cCI6MjAyMjQwMTk3OH0.4nH7Y9mPIkUwsc5VaBqNSMCC5FhKcmVKH40avwI0VRo',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c2d0enNpdWwiLCJpYXQiOjE3MTA4MjU5NzgsImV4cCI6MjAyMjQwMTk3OH0.4nH7Y9mPIkUwsc5VaBqNSMCC5FhKcmVKH40avwI0VRo'
            }
          }
        );
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
      <h1 className="header">Precision Flow AI</h1>
      <h3>Live Signal Feed</h3>

      <div className="toggle-group">
        <label>
          <input
            type="checkbox"
            checked={autoIBKR}
            onChange={() => setAutoIBKR(!autoIBKR)}
          />
          Auto Mode (IBKR)
        </label>
        <label>
          <input
            type="checkbox"
            checked={autoOANDA}
            onChange={() => setAutoOANDA(!autoOANDA)}
          />
          Auto Mode (OANDA)
        </label>
      </div>

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
          {signals.map((signal, index) => (
            <tr key={index}>
              <td>{new Date(signal.timestamp).toLocaleString()}</td>
              <td>{signal.platform}</td>
              <td>{signal.type}</td>
              <td>{signal.symbol}</td>
              <td>{signal.direction}</td>
              <td>{signal.strategy}</td>
              <td>{signal.confidence}%</td>
              <td>{signal.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
