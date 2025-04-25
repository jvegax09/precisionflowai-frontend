import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AUTO_MODE_UUID = 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4';

function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [lastTradeTime, setLastTradeTime] = useState('');

  // Load toggle states and last trade time from Supabase
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase
        .from('auto_mode')
        .select('*')
        .eq('id', AUTO_MODE_UUID)
        .single();

      if (data) {
        setAutoIBKR(data.auto_ibkr);
        setAutoOANDA(data.auto_oanda);
        setLastTradeTime(data.last_trade_time || '');
      }
    };

    fetchData();
  }, []);

  // Toggle handlers
  const handleToggle = async (field, value) => {
    if (field === 'auto_ibkr') setAutoIBKR(value);
    if (field === 'auto_oanda') setAutoOANDA(value);

    await supabase
      .from('auto_mode')
      .update({ [field]: value })
      .eq('id', AUTO_MODE_UUID);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Precision Flow AI</h1>

      <label style={styles.label}>
        <input
          type="checkbox"
          checked={autoIBKR}
          onChange={(e) => handleToggle('auto_ibkr', e.target.checked)}
        />
        Auto IBKR Mode
      </label>

      <label style={styles.label}>
        <input
          type="checkbox"
          checked={autoOANDA}
          onChange={(e) => handleToggle('auto_oanda', e.target.checked)}
        />
        Auto OANDA Mode
      </label>

      <div style={styles.status}>
        <strong>Status:</strong> Auto mode loaded successfully
      </div>

      <div style={styles.timestamp}>
        <strong>Last Trade Timestamp:</strong>{' '}
        {lastTradeTime || 'N/A'}
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '30px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#0a0a0a',
    color: '#f5f5f5',
    minHeight: '100vh',
  },
  header: {
    fontSize: '32px',
    marginBottom: '30px',
  },
  label: {
    display: 'block',
    marginBottom: '15px',
    fontSize: '20px',
  },
  status: {
    marginTop: '38px',
    fontSize: '18px',
  },
  timestamp: {
    marginTop: '10px',
    fontSize: '18px',
  },
};

export default App;