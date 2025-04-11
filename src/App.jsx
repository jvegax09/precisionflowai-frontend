import { useEffect, useState } from "react";
import "./App.css";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://waavlckmkmsggtxzsuji.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndhYXZsY2tta21zZ2d0eHpzdWppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MjI2MTgsImV4cCI6MjA1OTE5ODYxOH0.lCFo2-xDxp039f2EsJesSV7A3K05idNtOtRQvfi50NI"
);

function App() {
  const [ibkrEnabled, setIbkrEnabled] = useState(false);
  const [oandaEnabled, setOandaEnabled] = useState(false);
  const [status, setStatus] = useState("Loading auto mode...");
  const [lastTrade, setLastTrade] = useState(null);

  const UUID = "c2306db8-44f1-4aec-ac7c-9fe1215c1fd4";

  const fetchData = async () => {
    const { data, error } = await supabase
      .from("auto_mode")
      .select("*")
      .eq("id", UUID)
      .single();

    if (error) {
      setStatus("Failed to fetch auto mode state");
      return;
    }

    setIbkrEnabled(data.ibkr_enabled);
    setOandaEnabled(data.oanda_enabled);
    setStatus("Auto mode loaded successfully");
  };

  const fetchLastTrade = async () => {
    const { data, error } = await supabase
      .from("executions")
      .select("timestamp")
      .order("timestamp", { ascending: false })
      .limit(1)
      .single();

    if (!error && data?.timestamp) {
      const date = new Date(data.timestamp);
      setLastTrade(date.toLocaleString());
    }
  };

  const updateToggle = async (platform, value) => {
    await supabase
      .from("auto_mode")
      .update({ [platform]: value })
      .eq("id", UUID);

    if (platform === "ibkr_enabled") setIbkrEnabled(value);
    if (platform === "oanda_enabled") setOandaEnabled(value);
  };

  useEffect(() => {
    fetchData();
    fetchLastTrade();
    const interval = setInterval(fetchLastTrade, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="App">
      <h1>Precision Flow AI</h1>
      <p>Status: {status}</p>
      <label>
        <input
          type="checkbox"
          checked={ibkrEnabled}
          onChange={(e) => updateToggle("ibkr_enabled", e.target.checked)}
        />
        Auto IBKR Mode
      </label>
      <br />
      <label>
        <input
          type="checkbox"
          checked={oandaEnabled}
          onChange={(e) => updateToggle("oanda_enabled", e.target.checked)}
        />
        Auto OANDA Mode
      </label>
      <br />
      {lastTrade && <p>Last Trade Timestamp: {lastTrade}</p>}
    </div>
  );
}

export default App;