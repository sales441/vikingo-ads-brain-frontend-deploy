import React, { createContext, useContext, useState, useEffect } from "react";

const CompaniesContext = createContext(null);

const STORAGE_KEY = "vab_companies";
const SELECTED_KEY = "vab_selected_company";

const DEFAULT_COMPANIES = [
  {
    id: "demo-001",
    name: "Demo Company",
    legalName: "Demo Company LLC",
    website: "https://www.amazon.com/sp?seller=DEMO",
    marketplace: "US",
    currency: "USD",
    profileId: "123456789",
    advertiserId: "ADV123456",
    clientId: "",
    clientSecret: "",
    contactEmail: "admin@demo.com",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

export function CompaniesProvider({ children }) {
  const [companies, setCompanies] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_COMPANIES;
    } catch {
      return DEFAULT_COMPANIES;
    }
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState(() => {
    return localStorage.getItem(SELECTED_KEY) || "demo-001";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(SELECTED_KEY, selectedCompanyId);
  }, [selectedCompanyId]);

  const selectedCompany = companies.find(c => c.id === selectedCompanyId) || companies[0];

  const addCompany = (data) => {
    const company = {
      ...data,
      id: `comp-${Date.now()}`,
      marketplace: "US",
      currency: "USD",
      status: "active",
      createdAt: new Date().toISOString(),
    };
    setCompanies(prev => [...prev, company]);
    return company;
  };

  const updateCompany = (id, data) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  };

  const deleteCompany = (id) => {
    setCompanies(prev => {
      const filtered = prev.filter(c => c.id !== id);
      if (selectedCompanyId === id && filtered.length > 0) {
        setSelectedCompanyId(filtered[0].id);
      }
      return filtered;
    });
  };

  const selectCompany = (id) => {
    setSelectedCompanyId(id);
  };

  return (
    <CompaniesContext.Provider value={{
      companies,
      selectedCompany,
      selectedCompanyId,
      addCompany,
      updateCompany,
      deleteCompany,
      selectCompany,
    }}>
      {children}
    </CompaniesContext.Provider>
  );
}

export function useCompanies() {
  const ctx = useContext(CompaniesContext);
  if (!ctx) throw new Error("useCompanies must be used within CompaniesProvider");
  return ctx;
}
