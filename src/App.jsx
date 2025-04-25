import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://waavlckmkmsggtxzsuji.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXZsY2ttbXNnZ3R4enN1amkiLCJpYXQiOjE3MTA4MjU5NzgsImV4cCI6MjAyMjQwMTk3OH0.4nH7Y9mPIkUwsc5VaBqNSMCC5FhKcmVKH40avwI0VRo'
);

export default function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Loading...');
  const [lastTradeTimestamp, setLastTradeTimestamp] = useState('Loading...');

  const rowId = 'c230d0b0-44f1-4aec-ac7c-9fe1215c11d4'; // Fixed row ID

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('auto_mode')
        .select('auto_ibkr, auto_oanda')
        .eq('id', rowId)
        .single();

      if (error) {
        setStatusMessage('Error loading auto mode');
      } else {
        setAutoIBKR(data.auto_ibkr);
        setAutoOANDA(data.auto_oanda);
        setStatusMessage('Auto mode loaded successfully');
      }

      const { data: execData } = await supabase
        .from('executions')
        .select('signal_time')
        .order('signal_time', { ascending: false })
        .limit(1);

      if (execData && execData.length > 0) {
        const date = new Date(execData[0].signal_time);
        setLastTradeTimestamp(date.toLocaleString());
      } else {
        setLastTradeTimestamp('No trades yet');
      }
    };

    fetchData();
  }, []);

  const updateToggle = async (field, value) => {
    await supabase
      .from('auto_mode')
      .update({ [field]: value })
      .eq('id', rowId);

    if (field === 'auto_ibkr') setAutoIBKR(value);
    if (field === 'auto_oanda') setAutoOANDA(value);
  };

  return (
    <div style={{
      backgroundColor: '#121212',
      color: '#ffffff',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Precision Flow AI</h1>

      <div>
        <label>
          <input
            type="checkbox"
            checked={autoIBKR}
            onChange={(e) => updateToggle('auto_ibkr', e.target.checked)}
          />
          {' '}Auto IBKR Mode
        </label>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <label>
          <input
            type="checkbox"
            checked={autoOANDA}
            onChange={(e) => updateToggle('auto_oanda', e.target.checked)}
          />
          {' '}Auto OANDA Mode
        </label>
      </div>

      <p style={{ marginTop: '1rem' }}>
        <strong>Status:</strong> {statusMessage}
      </p>
      <p>
        <strong>Last Trade Timestamp:</strong> {lastTradeTimestamp}
      </p>
    </div>
  );
}