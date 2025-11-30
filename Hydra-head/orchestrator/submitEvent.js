import { hash, buildMerkleRoot } from './merkle.js';
import { bridge } from './hydraBridge.js';
// Simple in-memory state
let state = { merkleRoot: null, logs: [] };

export async function submitEvent(event){
  const eventHash = hash(event);
  const oldRoot = state.merkleRoot;
  const newLogs = [...state.logs, eventHash];
  const newRoot = buildMerkleRoot(newLogs);

  const tx = { from: 'HR', eventHash, oldRoot, newRoot };

  // Use bridge.commands.newTx to submit signed TX or submitTxSync depending on your flow
  if(bridge && bridge.commands && bridge.commands.newTx){
    try{
      await bridge.commands.newTx(tx, 'HR event');
    }catch(e){
      console.error('bridge newTx failed', e);
    }
  } else {
    console.log('Bridge newTx not available; simulated commit');
  }

  state = { merkleRoot: newRoot, logs: newLogs };
  return tx;
}
