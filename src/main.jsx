import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { CompaniesProvider } from "./context/CompaniesContext";
import { ProductsProvider } from "./context/ProductsContext";
import ErrorBoundary from "./components/ErrorBoundary";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <CompaniesProvider>
          <ProductsProvider>
            <App />
          </ProductsProvider>
        </CompaniesProvider>
      </AuthProvider>
    </BrowserRouter>
  </ErrorBoundary>
);
