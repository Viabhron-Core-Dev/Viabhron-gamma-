import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // --- HEALTH CHECK ---
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // --- SECURE INTERCOM (WEBHOOK RECEIVER) ---
  // This endpoint receives "External Pulses" from accredited agents (Copilot, Mistral, etc.)
  const pulses: any[] = [];

  app.post("/api/webhooks/pulse", (req, res) => {
    const { agentId, payload, signature } = req.body;
    
    // In a real sovereign OS, we would verify the signature here
    const pulse = {
      id: `pulse-${Date.now()}`,
      agentId,
      payload,
      timestamp: new Date().toISOString()
    };
    
    pulses.push(pulse);
    console.log(`[SECURE INTERCOM] Received pulse from agent: ${agentId}`);

    res.json({ status: "received", pulse });
  });

  app.get("/api/webhooks/pulses", (req, res) => {
    console.log(`[SECURE INTERCOM] Polling pulses... (${pulses.length} found)`);
    res.json(pulses);
  });

  // --- SOVEREIGN MONITOR SERVICE ---
  // This service simulates background monitoring for HTTP targets
  const activeMonitors = new Map<string, any>();

  app.post("/api/monitor/start", (req, res) => {
    const { id, name, target, condition, interval = 60000 } = req.body;
    
    if (activeMonitors.has(id)) {
      clearInterval(activeMonitors.get(id).timer);
    }

    console.log(`[MONITOR] Starting watcher: ${name} on ${target}`);
    
    const timer = setInterval(async () => {
      try {
        // In a real implementation, we would use fetch to check the target
        // and evaluate the condition. For now, we log the check.
        console.log(`[MONITOR] Checking ${name}...`);
        
        // Simulate a trigger event for demonstration if target contains 'trigger'
        if (target.includes('trigger')) {
          console.log(`[MONITOR] TRIGGER MATCHED for ${name}!`);
          // Here we would push a notification to Firestore
        }
      } catch (error) {
        console.error(`[MONITOR] Error checking ${name}:`, error);
      }
    }, interval);

    activeMonitors.set(id, { id, name, target, condition, timer });
    res.json({ status: "started", id });
  });

  app.post("/api/monitor/stop", (req, res) => {
    const { id } = req.body;
    if (activeMonitors.has(id)) {
      clearInterval(activeMonitors.get(id).timer);
      activeMonitors.delete(id);
      console.log(`[MONITOR] Stopped watcher: ${id}`);
      res.json({ status: "stopped" });
    } else {
      res.status(404).json({ error: "Monitor not found" });
    }
  });

  // --- VITE MIDDLEWARE ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🛡️ VIABHRON OS Kernel running on http://localhost:${PORT}`);
  });
}

startServer();
