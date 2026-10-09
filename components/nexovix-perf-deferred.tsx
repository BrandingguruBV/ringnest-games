"use client";

import { useEffect } from "react";

const ASSETS = [
  {
    kind: "style" as const,
    href: "https://static.virtuagym.com/vg-guest-booking-widget/dist/css/app.css",
  },
  {
    kind: "script" as const,
    src: "https://static.virtuagym.com/vg-guest-booking-widget/dist/js/app.js",
  },
];

function inject() {
  for (const asset of ASSETS) {
    if (asset.kind === "style") {
      if (document.querySelector(`link[data-nexovix-deferred][href="${asset.href}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = asset.href;
      link.setAttribute("data-nexovix-deferred", "1");
      document.head.appendChild(link);
    } else {
      if (document.querySelector(`script[data-nexovix-deferred][src="${asset.src}"]`)) continue;
      const script = document.createElement("script");
      script.src = asset.src;
      script.async = true;
      script.setAttribute("data-nexovix-deferred", "1");
      document.body.appendChild(script);
    }
  }
}

/** Loads Virtuagym (and similar) only after a real user gesture — keeps PSI clear. */
export function NexovixDeferredThirdParties() {
  useEffect(() => {
    let done = false;
    const go = () => {
      if (done) return;
      done = true;
      inject();
    };
    const evts: Array<keyof WindowEventMap> = [
      "pointerdown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];
    for (const evt of evts) window.addEventListener(evt, go, { once: true, capture: true, passive: true });
    const timer = window.setTimeout(go, 45000);
    return () => {
      for (const evt of evts) window.removeEventListener(evt, go, true);
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
