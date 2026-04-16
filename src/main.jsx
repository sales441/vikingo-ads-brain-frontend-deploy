import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CompaniesProvider } from "./context/CompaniesContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <CompaniesProvider>
        <App />
      </CompaniesProvider>
    </AuthProvider>
  </BrowserRouter>
);
