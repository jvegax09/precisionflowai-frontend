import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';

const AUTO_MODE_UUID = 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4';

function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [lastTradeTime, setLastTradeTime] = useState('');

  // Fetch auto mode status from Supabase
  useEffect(() => {
    async function fetchAutoMode() {
      const { data, error } = await supabase
        .from('auto_mode')
        .select('auto_ibkr, auto_oanda')
        .eq('id', AUTO_MODE_UUID)
        .single();

      if (error) {
        console.error('Error fetching auto mode:', error.message);
      } else {
        setAutoIBKR(data.auto_ibkr);
        setAutoOANDA(data.auto_oanda);
      }
    }

    async function fetchLastTimestamp() {
      const { data, error } = await supabase
        .from('executions')
        .select('signal_time')
        .order('signal_time', { ascending: false })
        .limit(1);

      if (!error && data.length > 0) {
        setLastTradeTime(new Date(data[0].signal_time).toLocaleString());
      }
    }

    fetchAutoMode();
    fetchLastTimestamp();
  }, []);

  // Update Supabase on toggle
  async function handleToggle(type) {
    const newState = type === 'ibkr' ? !autoIBKR : !autoOANDA;

    const updates = {
      auto_ibkr: type === 'ibkr' ? newState : autoIBKR,
      auto_oanda: type === 'oanda' ? newState : autoOANDA
    };

    const { error } = await supabase
      .from('auto_mode')
      .update(updates)
      .eq('id', AUTO_MODE_UUID);

    if (error) {
      alert('Error updating toggle: ' + error.message);
    } else {
      if (type === 'ibkr') setAutoIBKR(newState);
      if (type === 'oanda') setAutoOANDA(newState);
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      <h2>Precision Flow AI</h2>

      <div>
        <label>
          <input
            type="checkbox"
            checked={autoIBKR}
            onChange={() => handleToggle('ibkr')}
          />
          Auto IBKR Mode
        </label>
      </div>

      <div style={{ marginTop: '15px' }}>
        <label>
          <input
            type="checkbox"
            checked={autoOANDA}
            onChange={() => handleToggle('oanda')}
          />
          Auto OANDA Mode
        </label>
      </div>

      <div style={{ marginTop: '30px', fontSize: '18px' }}>
        <strong>Status:</strong> Auto mode loaded successfully
      </div>

      <div style={{ marginTop: '10px', fontSize: '18px' }}>
        <strong>Last Trade Timestamp:</strong>{' '}
        {lastTradeTime || 'Loading...'}
      </div>
    </div>
  );
}

export default App;