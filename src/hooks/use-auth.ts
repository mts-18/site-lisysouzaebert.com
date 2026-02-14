import { useCallback, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "admin_token";
const TOKEN_EXPIRY_KEY = "admin_token_expiry";

const isExpired = (expiry: number | null) => {
  if (!expiry) return true;
  return Date.now() > expiry;
};

export const useAuth = () => {
  const [token, setTokenState] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    const storedToken = window.localStorage.getItem(TOKEN_KEY);
    const storedExpiry = window.localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!storedToken || !storedExpiry) return null;

    const expiry = Number(storedExpiry);
    if (Number.isNaN(expiry) || isExpired(expiry)) {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(TOKEN_EXPIRY_KEY);
      return null;
    }

    return storedToken;
  });

  const authenticated = useMemo(() => Boolean(token), [token]);

  const setToken = useCallback((value: string, expiresInHours: number) => {
    const expiryTimestamp = Date.now() + expiresInHours * 60 * 60 * 1000;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(TOKEN_KEY, value);
      window.localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTimestamp.toString());
    }
    setTokenState(value);
  }, []);

  const clearToken = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(TOKEN_KEY);
      window.localStorage.removeItem(TOKEN_EXPIRY_KEY);
    }
    setTokenState(null);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedExpiry = window.localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!storedExpiry) {
      return;
    }

    const expiry = Number(storedExpiry);
    if (Number.isNaN(expiry)) {
      clearToken();
      return;
    }

    if (isExpired(expiry)) {
      clearToken();
      return;
    }

    const timeout = window.setTimeout(() => {
      clearToken();
    }, expiry - Date.now());

    return () => window.clearTimeout(timeout);
  }, [clearToken, token]);

  return { token, authenticated, setToken, clearToken };
};
