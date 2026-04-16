import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationsContext = createContext(null);
const STORAGE_KEY = "vab_notifications";
const MAX_STORED = 100;

// Seed data so the bell has something to show on first load (demo mode).
const SEED_NOTIFICATIONS = [
  {
    id: "seed-1",
    type: "acos_alert",
    severity: "critical",
    title: "Campaign ACoS spiked",
    message: "SP - Main Product | Broad jumped to 38% ACoS (target 25%). The AI suggests lowering top-KW bids 20%.",
    route: "/campaigns",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    read: false,
  },
  {
    id: "seed-2",
    type: "stock_alert",
    severity: "warning",
    title: "Inventory running low",
    message: "Universal Replacement Gasket has only 5 units left (~1 day of sales). Consider reorder.",
    route: "/inventory",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    read: false,
  },
  {
    id: "seed-3",
    type: "ai_insight",
    severity: "info",
    title: "AI found a keyword opportunity",
    message: "'cheap product fast delivery' has very high opportunity and no active ad. Consider adding it.",
    route: "/competition",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    read: true,
  },
];

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed && parsed.length > 0 ? parsed : SEED_NOTIFICATIONS;
    } catch {
      return SEED_NOTIFICATIONS;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_STORED)));
  }, [notifications]);

  const push = useCallback((notif) => {
    const full = {
      id: notif.id || `n-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: notif.type || "info",
      severity: notif.severity || "info",
      title: notif.title || "Notification",
      message: notif.message || "",
      route: notif.route || null,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [full, ...prev].slice(0, MAX_STORED));
    return full.id;
  }, []);

  const markRead = useCallback((id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const remove = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clear = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationsContext.Provider
      value={{ notifications, unreadCount, push, markRead, markAllRead, remove, clear }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}
