import express from 'express';
import bodyParser from 'body-parser';
import { submitEvent } from './submitEvent.js';
import { connectBridge } from './hydraBridge.js';
const app = express();
app.use(bodyParser.json());

app.post('/event', async (req, res) => {
  try {
    const { event } = req.body;
    if (!event) return res.status(400).json({ error: 'event required' });
    const tx = await submitEvent(event);
    res.json({ status: 'submitted', tx });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

// start bridge connection at boot
(async () => {
  await connectBridge();
  app.listen(9000, () => console.log('Orchestrator listening on :9000'));
})();
