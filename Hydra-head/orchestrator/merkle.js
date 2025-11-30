      import CryptoJS from 'crypto-js';
      export function hash(obj) { return CryptoJS.SHA256(JSON.stringify(obj)).toString(); }

      export function combineHash(a,b){ return CryptoJS.SHA256(a+b).toString(); }

      export function buildMerkleRoot(hashes){
if(!hashes||hashes.length===0) return null;
let layer=[...hashes];
if(layer.length===1) return layer[0];
while(layer.length>1){ const next=[]; for(let i=0;i<layer.length;i+=2){ const L=layer[i]; const R=layer[i+1]||L; next.push(combineHash(L,R)); } layer=next; } return layer[0]; }
