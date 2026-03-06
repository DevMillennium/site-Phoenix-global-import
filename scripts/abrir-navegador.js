#!/usr/bin/env node
/**
 * Aguarda o servidor Next.js responder e abre o navegador.
 * Usado por: npm run dev:open
 */

const { execSync } = require("child_process");
const net = require("net");

const PORTAS = [3000, 3001, 3002, 3003];
const INTERVALO_MS = 500;
const TIMEOUT_MS = 60000;

function portaDisponivel(porta) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 2000);
    socket.connect(porta, "127.0.0.1", () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(true);
    });
    socket.on("error", () => {
      clearTimeout(timeout);
      resolve(false);
    });
  });
}

async function aguardarServidor() {
  const inicio = Date.now();
  while (Date.now() - inicio < TIMEOUT_MS) {
    for (const porta of PORTAS) {
      if (await portaDisponivel(porta)) {
        return porta;
      }
    }
    await new Promise((r) => setTimeout(r, INTERVALO_MS));
  }
  return null;
}

function abrirNavegador(url) {
  const comando = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
  execSync(`${comando} "${url}"`, { stdio: "ignore" });
}

(async () => {
  const porta = await aguardarServidor();
  if (porta) {
    abrirNavegador(`http://localhost:${porta}`);
  }
})();
