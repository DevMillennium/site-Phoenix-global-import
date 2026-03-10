"use client";

import { useState, useCallback } from "react";

const DEVICES = [
  { id: "iphone14", name: "iPhone 14 Pro", width: 393, height: 852 },
  { id: "iphone14max", name: "iPhone 14 Pro Max", width: 430, height: 932 },
  { id: "pixel7", name: "Pixel 7", width: 412, height: 915 },
  { id: "samsung", name: "Samsung S24", width: 360, height: 780 },
] as const;

const PAGES = [
  { path: "/", label: "Home" },
  { path: "/produtos", label: "Produtos" },
  { path: "/produtos?categoria=audio", label: "Áudio" },
  { path: "/contato", label: "Contato" },
  { path: "/sobre", label: "Sobre" },
  { path: "/carrinho", label: "Carrinho" },
];

export default function EmuladorMobilePage() {
  const [device, setDevice] = useState<(typeof DEVICES)[number]>(DEVICES[0]);
  const [path, setPath] = useState("/");
  const [key, setKey] = useState(0);

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}`
      : "http://localhost:3000";
  const iframeSrc = `${baseUrl}${path}`;

  const refresh = useCallback(() => {
    setKey((k) => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-phoenix-surface flex flex-col">
      <header className="border-b border-phoenix-border bg-phoenix-dark/80 backdrop-blur px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-sm font-semibold text-phoenix-text">
              Emulador Mobile
            </h1>
            <p className="text-xs text-phoenix-text-muted mt-0.5">
              Phoenix Global — vista em celular
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={device.id}
              onChange={(e) => {
                const d = DEVICES.find((x) => x.id === e.target.value);
                if (d) setDevice(d);
              }}
              className="rounded-lg border border-phoenix-border bg-phoenix-card px-3 py-2 text-xs font-medium text-phoenix-text focus:outline-none focus:ring-2 focus:ring-phoenix-primary"
              aria-label="Dispositivo"
            >
              {DEVICES.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.width}×{d.height})
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={refresh}
              className="rounded-lg border border-phoenix-border bg-phoenix-card px-3 py-2 text-xs font-medium text-phoenix-text hover:bg-phoenix-border transition-colors focus:outline-none focus:ring-2 focus:ring-phoenix-primary"
              aria-label="Recarregar iframe"
            >
              Atualizar
            </button>
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap gap-1.5" aria-label="Páginas">
          {PAGES.map((p) => (
            <button
              key={p.path}
              type="button"
              onClick={() => setPath(p.path)}
              className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-phoenix-primary ${
                path === p.path
                  ? "bg-phoenix-primary text-white"
                  : "bg-phoenix-card text-phoenix-text-muted hover:bg-phoenix-border hover:text-phoenix-text"
              }`}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="flex-1 flex items-start justify-center p-4 md:p-8 overflow-auto">
        <div
          className="emulador-frame relative rounded-[2.5rem] border-[10px] border-phoenix-card bg-phoenix-dark shadow-2xl"
          style={
            {
              "--emw": `${device.width + 20}px`,
              "--emh": `${device.height + 20}px`,
              "--ifw": `${device.width}px`,
              "--ifh": `${device.height}px`,
            } as React.CSSProperties
          }
        >
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 z-10 h-6 w-28 rounded-b-2xl bg-phoenix-dark"
            aria-hidden
          />
          <div className="emulador-inner absolute inset-[10px] rounded-[2rem] overflow-hidden bg-phoenix-dark">
            <iframe
              key={key}
              src={iframeSrc}
              title="Site Phoenix Global — vista mobile"
              className="emulador-iframe w-full h-full border-0 bg-phoenix-dark"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
