import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

const AUTO_MODE_UUID = 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4';

function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [lastTradeTime, setLastTradeTime] = useState('');

  useEffect(() => {
    const fetchAutoMode = async () => {
      const { data, error } = await supabase
        .from('auto_mode')
        .select('auto_ibkr, auto_oanda, updated_at')
        .eq('id', AUTO_MODE_UUID)
        .single();

      if (data) {
        setAutoIBKR(data.auto_ibkr);
        setAutoOANDA(data.auto_oanda);
        setLastTradeTime(data.updated_at);
      }
    };

    fetchAutoMode();
  }, []);

  const updateToggle = async (field, value) => {
    const { error } = await supabase
      .from('auto_mode')
      .update({ [field]: value })
      .eq('id', AUTO_MODE_UUID);

    if (!error) {
      if (field === 'auto_ibkr') setAutoIBKR(value);
      if (field === 'auto_oanda') setAutoOANDA(value);
    }
  };

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Precision Flow AI</h1>

      <label style={{ display: 'block', marginBottom: '15px', fontSize: '20px' }}>
        <input
          type="checkbox"
          checked={autoIBKR}
          onChange={(e) => updateToggle('auto_ibkr', e.target.checked)}
        />{' '}
        Auto IBKR Mode
      </label>

      <label style={{ display: 'block', marginBottom: '15px', fontSize: '20px' }}>
        <input
          type="checkbox"
          checked={autoOANDA}
          onChange={(e) => updateToggle('auto_oanda', e.target.checked)}
        />{' '}
        Auto OANDA Mode
      </label>

      <div style={{ marginTop: '30px', fontSize: '18px' }}>
        <strong>Status:</strong> Auto mode loaded successfully
      </div>

      <div style={{ marginTop: '10px', fontSize: '18px' }}>
        <strong>Last Trade Timestamp:</strong>{' '}
        {lastTradeTime ? new Date(lastTradeTime).toLocaleString() : 'Loading...'}
      </div>
    </div>
  );
}

export default App;