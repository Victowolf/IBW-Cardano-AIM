import { HydraBridge } from '@hydra-sdk/bridge';
import { HexcoreConnector } from '@hydra-sdk/bridge';

// Connect to local hydra-node endpoints (assumes hydra-node exposes websocket)
const urls = ['ws://hydra-node-hr:4001', 'ws://hydra-node-legal:4002', 'ws://hydra-node-audit:4003'];
export let bridge = null;

export async function connectBridge() {
  // use the first node as primary connect point for demo
  const url = process.env.HYDRA_WS_URL || urls[0];
  bridge = new HydraBridge({ url, verbose: true });

  bridge.events.on('onConnected', () => console.log('HydraBridge connected to', url));
  bridge.events.on('onMessage', (payload) => console.log('HydraBridge onMessage', payload.tag));
  bridge.events.on('onDisconnected', () => console.log('HydraBridge disconnected'));

  await bridge.connect();
  return bridge;
}
