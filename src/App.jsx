import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [lastSignalTime, setLastSignalTime] = useState('');
  const [statusMessage, setStatusMessage] = useState('Loading...');
  const rowUUID = 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4'; // your static UUID

  useEffect(() => {
    const fetchToggleStates = async () => {
      const { data, error } = await supabase
        .from('auto_mode')
        .select('auto_ibkr, auto_oanda, last_signal_time')
        .eq('id', rowUUID)
        .single();

      if (error) {
        console.error('Failed to fetch auto mode:', error);
        setStatusMessage('Error loading status');
      } else {
        setAutoIBKR(data.auto_ibkr);
        setAutoOANDA(data.auto_oanda);
        setLastSignalTime(data.last_signal_time || 'N/A');
        setStatusMessage('Auto mode loaded successfully');
      }
    };

    fetchToggleStates();
  }, []);

  const updateToggle = async (field, value) => {
    const { error } = await supabase
      .from('auto_mode')
      .update({ [field]: value })
      .eq('id', rowUUID);

    if (error) {
      console.error('Failed to update toggle:', error);
    }
  };

  const handleIBKRToggle = () => {
    const newValue = !autoIBKR;
    setAutoIBKR(newValue);
    updateToggle('auto_ibkr', newValue);
  };

  const handleOANDAToggle = () => {
    const newValue = !autoOANDA;
    setAutoOANDA(newValue);
    updateToggle('auto_oanda', newValue);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Precision Flow AI</h1>

      <div style={{ marginTop: '20px' }}>
        <label>
          <input type="checkbox" checked={autoIBKR} onChange={handleIBKRToggle} />
          Auto IBKR Mode
        </label>
      </div>

      <div style={{ marginTop: '10px' }}>
        <label>
          <input type="checkbox" checked={autoOANDA} onChange={handleOANDAToggle} />
          Auto OANDA Mode
        </label>
      </div>

      <div style={{ marginTop: '30px' }}>
        <strong>Status:</strong> {statusMessage}
      </div>

      <div style={{ marginTop: '10px' }}>
        <strong>Last Trade Timestamp:</strong> {lastSignalTime}
      </div>
    </div>
  );
}

export default App;