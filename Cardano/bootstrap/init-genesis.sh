#!/bin/sh
set -e
OUTDIR="$1"
mkdir -p "$OUTDIR"
cd "$OUTDIR"

echo "=== Init genesis in $OUTDIR ==="
mkdir -p db sockets keys

# Minimal topology
cat > topology.json <<'EOF'
{
  "Producers": [
    {
      "addr": "127.0.0.1",
      "port": 3001,
      "valency": 1
    }
  ]
}
EOF

# Generate genesis-funded keypair
cardano-cli address key-gen \
  --verification-key-file keys/genesis-pay.vkey \
  --signing-key-file keys/genesis-pay.skey

cardano-cli address build \
  --payment-verification-key-file keys/genesis-pay.vkey \
  --out-file keys/genesis-pay.addr \
  --mainnet 2>/dev/null || true

if [ ! -s keys/genesis-pay.addr ]; then
  cardano-cli address build \
    --payment-verification-key-file keys/genesis-pay.vkey \
    --out-file keys/genesis-pay.addr
fi

GENESIS_ADDR=$(cat keys/genesis-pay.addr)
echo "Genesis address: $GENESIS_ADDR"

NOW=$(date +%s)
START_TIME=$((NOW - 60))

cat > genesis.json <<EOF
{
  "systemStart": $START_TIME,
  "networkMagic": 42,
  "activeSlotsCoefficient": 0.5,
  "epochLength": 100,
  "slotLength": 1,
  "maxKESEvolutions": 62,
  "securityParam": 2160,
  "slotsPerKESPeriod": 129600,
  "maxLovelaceSupply": 45000000000000000,
  "protocolParams": {
    "minFeeA": 44,
    "minFeeB": 155381,
    "maxBlockBodySize": 65536,
    "maxTxSize": 16384,
    "keyDeposit": 2000000,
    "poolDeposit": 500000000,
    "eMax": 18,
    "decentralisationParam": 0,
    "extraEntropy": null,
    "protocolVersion": { "major": 6, "minor": 0 }
  },
  "initialFunds": {
    "$GENESIS_ADDR": 1000000000000
  },
  "protocolParamsUpdate": {},
  "initialUTxO": {}
}
EOF

cat > config.json <<'EOF'
{
  "Filepaths": {
    "shelleyGenesisFile": "/data/genesis.json"
  },
  "Network": {
    "Magic": 42
  }
}
EOF

echo "Genesis init complete."
ls -la
