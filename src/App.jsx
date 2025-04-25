import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Supabase setup
const supabaseUrl = "https://waavlckmkmsggtxzsuji.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indhb2x2bGNraW54c2d0enNpdWwiLCJpYXQiOjE3MTA4MjU5NzgsImV4cCI6MjAyMjQwMTk3OH0.4nH7Y9mPIkUwsc5VaBqNSMCC5FhKcmVKH40avwI0VRo";
const supabase = createClient(supabaseUrl, supabaseKey);

// Auto Mode Row UUID
const AUTO_MODE_UUID = "c230d0b0-44f1-4aec-ac7c-9fe1215c11d4";

function App() {
  const [autoMode, setAutoMode] = useState({
    auto_ibkr: false,
    auto_oanda: false,
  });

  const [lastTrade, setLastTrade] = useState(null);

  // Fetch auto mode and latest trade
  useEffect(() => {
    const fetchToggleState = async () => {
      const { data, error } = await supabase
        .from("auto_mode")
        .select("*")
        .eq("id", AUTO_MODE_UUID)
        .single();

      if (error) {
        console.error("Error loading toggle state:", error.message);
      } else {
        setAutoMode({
          auto_ibkr: data.auto_ibkr,
          auto_oanda: data.auto_oanda,
        });
      }
    };

    fetchToggleState();
    const interval = setInterval(fetchLastTradeTime, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch the last trade timestamp
  const fetchLastTradeTime = async () => {
    const { data, error } = await supabase
      .from("executions")
      .select("signal_time")
      .order("signal_time", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Error fetching trade timestamp:", error.message);
    } else if (data.length > 0) {
      const date = new Date(data[0].signal_time);
      setLastTrade(date.toLocaleString());
    }
  };

  // Handle toggle switch
  const handleToggle = async (key) => {
    const updated = !autoMode[key];
    setAutoMode((prev) => ({ ...prev, [key]: updated }));

    const { error } = await supabase
      .from("auto_mode")
      .update({ [key]: updated })
      .eq("id", AUTO_MODE_UUID);

    if (error) {
      console.error("Error updating toggle:", error.message);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Precision Flow AI</h1>

      <div style={styles.toggleContainer}>
        <label style={styles.label}>
          <input
            type="checkbox"
            checked={autoMode.auto_ibkr}
            onChange={() => handleToggle("auto_ibkr")}
          />
          Auto IBKR Mode
        </label>

        <label style={styles.label}>
          <input
            type="checkbox"
            checked={autoMode.auto_oanda}
            onChange={() => handleToggle("auto_oanda")}
          />
          Auto OANDA Mode
        </label>
      </div>

      <p style={styles.status}>
        Status: <strong>Auto mode loaded successfully</strong>
      </p>

      <p style={styles.timestamp}>
        Last Trade Timestamp: <strong>{lastTrade || "Loading..."}</strong>
      </p>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#121212",
    color: "#fff",
    fontFamily: "Arial, sans-serif",
    textAlign: "center",
    padding: "40px",
    minHeight: "100vh",
  },
  title: {
    fontSize: "36px",
    marginBottom: "30px",
  },
  toggleContainer: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "15px",
    fontSize: "20px",
  },
  status: {
    marginTop: "30px",
    fontSize: "18px",
  },
  timestamp: {
    marginTop: "10px",
    fontSize: "18px",
  },
};

export default App;