import React from "react";
import { createRoot } from "react-dom/client";

function App() {
  return (
    <div style={{ padding: 20, fontFamily: "system-ui, Arial" }}>
      <h1>Vikingo Ads Brain™ ✅</h1>
      <p>App rodando com Vite + React (sem SVG e sem App.css).</p>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
