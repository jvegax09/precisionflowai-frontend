import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AUTO_MODE_UUID = 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4';

export default function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState('');

  useEffect(() => {
    const fetchAutoMode = async () => {
      const { data, error } = await supabase
        .from('auto_mode')
        .select('auto_ibkr, auto_oanda, last_trade_timestamp')
        .eq('id', AUTO_MODE_UUID)
        .single();

      if (!error && data) {
        setAutoIBKR(data.auto_ibkr);
        setAutoOANDA(data.auto_oanda);
        setLastTimestamp(data.last_trade_timestamp || '');
      }
    };

    fetchAutoMode();
  }, []);

  const handleToggle = async (key, value) => {
    if (key === 'auto_ibkr') setAutoIBKR(value);
    if (key === 'auto_oanda') setAutoOANDA(value);

    await supabase
      .from('auto_mode')
      .update({ [key]: value })
      .eq('id', AUTO_MODE_UUID);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Precision Flow AI</h1>

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
        {lastTimestamp ? new Date(lastTimestamp).toLocaleString() : 'N/A'}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    padding: '40px',
    backgroundColor: '#0d1117',
    color: '#f0f6fc',
    minHeight: '100vh',
  },
  title: {
    fontSize: '28px',
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