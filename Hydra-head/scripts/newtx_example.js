// newTx example using bridge.commands.newTx (pseudocode)
import { HydraBridge } from '@hydra-sdk/bridge';
const bridge = new HydraBridge({ url: 'ws://localhost:4001' });
(async()=>{
  await bridge.connect();
  // tx should be a CBOR hex in production. Here we send a JSON placeholder for demo.
  await bridge.commands.newTx({ placeholder: true }, 'demo tx');
  console.log('newTx sent');
  process.exit(0);
})();
