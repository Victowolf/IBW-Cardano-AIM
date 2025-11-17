import hashlib
import random

def random_txhash():
    return hashlib.sha256(str(random.random()).encode()).hexdigest()

def short(h):
    return h[:20]  # truncate like cardano-cli does visually

class MockCardano:
    def __init__(self):
        self.block_height = 0
        self.wallet = "addr_test1vz95f8agentdemo"
        self.genesis()

    def genesis(self):
        print("\n=== Genesis Block (#0) ===")
        print("TxHash                                 TxIx        Amount")
        print("------------------------------------------------------------------------")
        
        txh = random_txhash()
        print(f"{short(txh)}...            0           1000000000 lovelace")
        print("")

    def add_block(self):
        self.block_height += 1

        print(f"\n=== Block #{self.block_height} ===")
        print("TxHash                                 TxIx        Amount")
        print("------------------------------------------------------------------------")

        txh = random_txhash()
        amount = 1000000  # EXACTLY 1 ADA (in lovelace)
        print(f"{short(txh)}...            0           {amount} lovelace + TxOutDatumHash\n")

    def run_12_blocks(self):
        for _ in range(12):
            self.add_block()


if __name__ == "__main__":
    chain = MockCardano()
    chain.run_12_blocks()
