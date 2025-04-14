import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// Your actual UUID
const AUTO_MODE_UUID = 'c2306bd8-44f1-4aec-ac7c-9fe1215c11d4';

function App() {
  const [autoIBKR, setAutoIBKR] = useState(false);
  const [autoOANDA, setAutoOANDA] = useState(false);
  const [status, setStatus] = useState('Loading...');
  const [lastTradeTime, setLastTradeTime] = useState(null);

  // Fetch current toggle state
  const fetchAutoMode = async () => {
    const { data, error } = await supabase
      .from('auto_mode')
      .select('*')
      .eq('uuid', import.meta.env.VITE_AUTO_MODE_UUID)
      .single();
  
    if (error) {
      console.error('Supabase fetch error:', error);
      setStatus(`Fetch failed: ${error.message}`);
    } else {
      setAutoIBKR(data.ibkr_enabled);
      setAutoOANDA(data.oanda_enabled);
      setStatus('Auto mode loaded successfully');
    }
  };

  // Fetch last trade timestamp
  const fetchLastTradeTimestamp = async () => {
    const { data, error } = await supabase
      .from('executions')
      .select('timestamp')
      .order('timestamp', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Error fetching last trade:', error);
    } else if (data && data.timestamp) {
      setLastTradeTime(new Date(data.timestamp).toLocaleString());
    }
  };

  useEffect(() => {
    fetchAutoMode();
    fetchLastTradeTimestamp();
  }, []);

  return (
    <div style={{ padding: '2rem', color: 'white', background: '#111', minHeight: '100vh' }}>
      <h1 style={{ color: '#4fc3f7' }}>Precision Flow AI</h1>
      <p>Status: {status}</p>
      <div>
        <label>
          <input type="checkbox" checked={autoIBKR} readOnly /> Auto IBKR Mode
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" checked={autoOANDA} readOnly /> Auto OANDA Mode
        </label>
      </div>
      <p>Last Trade Timestamp: {lastTradeTime || 'Loading...'}</p>
    </div>
  );
}

export default App;