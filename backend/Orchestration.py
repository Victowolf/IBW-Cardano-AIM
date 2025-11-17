# orchestration.py
import time
import json
from Agent1 import run_agent1
from Agent2 import run_agent2
from Agent3 import run_agent3

# Dictionary mapping agent names to their run functions
AGENTS = {
    "Agent1": run_agent1,
    "Agent2": run_agent2,
    "Agent3": run_agent3
}

# Interval in seconds (10 minutes)
INTERVAL = 10 * 60


def run_all_agents_forever(shared_dict):
    while True:
        print("\n[INFO] Running all agents...")
        for agent_name, agent_func in AGENTS.items():
            try:
                output = agent_func()
                shared_dict[agent_name + "_Output"] = output
                print(f"[INFO] {agent_name} ran successfully.")
            except Exception as e:
                shared_dict[agent_name + "_Output"] = {"error": str(e)}
                print(f"[ERROR] {agent_name} failed: {e}")

        print(f"[INFO] Sleeping for {INTERVAL / 60} minutes...\n")
        time.sleep(INTERVAL)

