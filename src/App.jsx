import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AUTO_MODE_UUID = 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4';

function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [lastTradeTime, setLastTradeTime] = useState('');

  useEffect(() => {
    fetchAutoModes();
  }, []);

  const fetchAutoModes = async () => {
    const { data, error } = await supabase
      .from('auto_mode')
      .select('*')
      .eq('id', AUTO_MODE_UUID)
      .single();

    if (data) {
      setAutoIBKR(data.auto_ibkr);
      setAutoOANDA(data.auto_oanda);
      setLastTradeTime(data.last_trade_time || '');
    }

    if (error) {
      console.error('Error fetching auto modes:', error.message);
    }
  };

  const updateToggle = async (field, value) => {
    const updates = {};
    updates[field] = value;

    const { error } = await supabase
      .from('auto_mode')
      .update(updates)
      .eq('id', AUTO_MODE_UUID);

    if (error) {
      console.error(`Error updating ${field}:`, error.message);
    }
  };

  const handleIBKRToggle = async () => {
    const newValue = !autoIBKR;
    setAutoIBKR(newValue);
    await updateToggle('auto_ibkr', newValue);
  };

  const handleOANDAToggle = async () => {
    const newValue = !autoOANDA;
    setAutoOANDA(newValue);
    await updateToggle('auto_oanda', newValue);
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h1 style={{ marginBottom: '20px' }}>Precision Flow AI</h1>

      <label>
        <input
          type="checkbox"
          checked={autoIBKR}
          onChange={handleIBKRToggle}
        />
        Auto IBKR Mode
      </label>

      <br />

      <label style={{ marginTop: '10px' }}>
        <input
          type="checkbox"
          checked={autoOANDA}
          onChange={handleOANDAToggle}
        />
        Auto OANDA Mode
      </label>

      <div style={{ marginTop: '30px', fontSize: '18px' }}>
        <strong>Status:</strong> Auto mode loaded successfully
      </div>

      <div style={{ marginTop: '10px', fontSize: '18px' }}>
        <strong>Last Trade Timestamp:</strong> {lastTradeTime || 'Loading...'}
      </div>
    </div>
  );
}

export default App;