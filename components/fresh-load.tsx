"use client";

import { useEffect } from "react";

function expireCookie(name: string, domain?: string) {
  const base = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;max-age=0`;
  document.cookie = domain ? `${base};domain=${domain}` : base;
}

export function FreshLoad() {
  useEffect(() => {
    const names = document.cookie
      .split(";")
      .map((part) => part.split("=")[0]?.trim())
      .filter(Boolean);
    const host = window.location.hostname;
    const parent = host.includes(".") ? host.slice(host.indexOf(".")) : host;
    for (const name of names) {
      expireCookie(name);
      expireCookie(name, host);
      expireCookie(name, `.${host}`);
      expireCookie(name, parent);
    }
    try {
      sessionStorage.clear();
    } catch {
      // ignore blocked storage
    }
    if ("caches" in window) {
      void caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))));
    }
  }, []);

  return null;
}
