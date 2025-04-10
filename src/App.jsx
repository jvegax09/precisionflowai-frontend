import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

const supabase = createClient(
  'https://waolvlckinxsgtxziul.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c3R6aXV...'
);

function App() {
  const [signals, setSignals] = useState([]);
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);

  const fetchSignals = async () => {
    try {
      const response = await axios.get(
        'https://waolvlckinxsgtxziul.supabase.co/rest/v1/signals?select=*',
        {
          headers: {
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c3R6aXV...',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c3R6aXV...'
          }
        }
      );
      setSignals(response.data.reverse());
    } catch (error) {
      console.error('Error fetching signals:', error);
    }
  };

  const fetchAutoMode = async () => {
    const { data, error } = await supabase
      .from('auto_mode')
      .select('auto_ibkr, auto_oanda')
      .eq('id', 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4')
      .single();

    if (data) {
      setAutoIBKR(data.auto_ibkr);
      setAutoOANDA(data.auto_oanda);
    }
  };

  const updateAutoMode = async (field, value) => {
    const { error } = await supabase
      .from('auto_mode')
      .update({ [field]: value })
      .eq('id', 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4');

    if (error) console.error(`Error updating ${field}:`, error);
  };

  useEffect(() => {
    fetchSignals();
    fetchAutoMode();
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
            onChange={() => {
              const newVal = !autoIBKR;
              setAutoIBKR(newVal);
              updateAutoMode('auto_ibkr', newVal);
            }}
          />
          Auto Mode (IBKR)
        </label>

        <label>
          <input
            type="checkbox"
            checked={autoOANDA}
            onChange={() => {
              const newVal = !autoOANDA;
              setAutoOANDA(newVal);
              updateAutoMode('auto_oanda', newVal);
            }}
          />
          Auto Mode (OANDA)
        </label>
      </div>

      <div className="signals-table">
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
                <td>{signal.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
