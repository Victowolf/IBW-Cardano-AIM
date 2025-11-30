// src/pages/Configuration.tsx
import React, { useMemo, useState, useEffect } from "react";

/* ----------------------------- Types ------------------------------ */
type Agent = {
  id: string;
  name: string;
  description: string;
  instructions: string;
};

type PhaseType = "agent" | "manual";

type Phase = {
  id: string;
  title: string;
  type: PhaseType;
  agentId?: string | null;
  instructions: string;
};

/* ------------------------- Helpers ---------------------- */

const uid = (prefix = "") =>
  prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

/* ----------------------- DEFAULT AGENTS ----------------------- */

const defaultAgents = (): Agent[] => [
  {
    id: "agent-1",
    name: "Agent 1 — HR ANALYTICS",
    description:
      "Collects HR data, identifies workforce patterns, and generates real-time insights.",
    instructions:
      "Analyze HR datasets. Highlight attrition patterns, performance spikes, and workforce trends.",
  },
  {
    id: "agent-2",
    name: "Agent 2 — COMPANY NEWS",
    description:
      "Fetches and summarizes company announcements and HR policy updates.",
    instructions:
      "Monitor internal platforms. Summarize updates in clean digest format with timestamps.",
  },
  {
    id: "agent-3",
    name: "Agent 3 — NOTIFICATION & TASK AUTOMATION",
    description:
      "Creates and schedules automated HR reminders, alerts, and follow-ups.",
    instructions:
      "Identify pending HR tasks. Generate reminders. Track overdue tasks and escalate when needed.",
  },
  {
    id: "agent-4",
    name: "Agent 4 — JOB LISTINGS & APPLICATIONS",
    description:
      "Manages job postings, applicants, and the whole recruitment workflow.",
    instructions:
      "Maintain job listings. Monitor applications. Trigger CV scanning, testing, and interviews.",
  },
  {
    id: "agent-5",
    name: "Agent 5 — ONBOARDING & ORIENTATION",
    description:
      "Handles onboarding tasks, documentation and orientation flow.",
    instructions:
      "Generate onboarding checklists. Track completion. Schedule sessions and send reminders.",
  },
  {
    id: "agent-6",
    name: "Agent 6 — PERFORMANCE MANAGEMENT",
    description:
      "Manages performance cycles and generates productivity insights.",
    instructions:
      "Review KPIs. Track improvement. Produce quarterly evaluation summaries.",
  },
];

/* ----------------------- DEFAULT JOB LISTING PHASES ----------------------- */

const defaultPhases = (agents: Agent[]): Phase[] => [
  {
    id: "phase-cv",
    title: "CV Scan",
    type: "agent",
    agentId: "agent-4",
    instructions: "Automated parsing & shortlisting using AI.",
  },
  {
    id: "phase-test",
    title: "Test Generation",
    type: "agent",
    agentId: "agent-4",
    instructions: "Generate job-specific assessments.",
  },
  {
    id: "phase-tech",
    title: "Technical Interview",
    type: "agent",
    agentId: "agent-4",
    instructions: "Conduct technical rounds & score responses.",
  },
  {
    id: "phase-behaviour",
    title: "Behavioural Interview",
    type: "agent",
    agentId: "agent-4",
    instructions: "Assess communication & cultural fit.",
  },
];

/* -------------------------- Main Component ------------------------ */

const Configuration: React.FC = () => {
  const initial = useMemo(() => {
    const agents = defaultAgents();
    const phases = defaultPhases(agents);
    return { agents, phases };
  }, []);

  const [agents, setAgents] = useState<Agent[]>(initial.agents);
  const [phases, setPhases] = useState<Phase[]>(initial.phases);
  const [selectedAgentId, setSelectedAgentId] = useState(initial.agents[0].id);

  // which agent / phase is currently being edited (IDs) — used to mount editor components
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [editingPhaseId, setEditingPhaseId] = useState<string | null>(null);

  /* ----------------------- AGENT CRUD ----------------------- */

  const selectedAgent =
    agents.find((a) => a.id === selectedAgentId) || agents[0] || null;

  const selectAgent = (id: string) => {
    setSelectedAgentId(id);
    // stop any phase edits when switching agent
    setEditingPhaseId(null);
  };

  const addAgent = () => {
    const newAgent: Agent = {
      id: uid("agent-"),
      name: `Agent ${agents.length + 1}`,
      description: "New agent description...",
      instructions: "New agent instructions...",
    };
    setAgents((s) => [...s, newAgent]);
    setSelectedAgentId(newAgent.id);
    setEditingAgentId(newAgent.id); // open editor for new agent
  };

  const resetAgents = () => {
    if (!confirm("Reset all agents and phases to defaults?")) return;
    const list = defaultAgents();
    setAgents(list);
    setPhases(defaultPhases(list));
    setSelectedAgentId(list[0].id);
    setEditingAgentId(null);
    setEditingPhaseId(null);
  };

  const updateAgent = (updated: Agent) => {
    setAgents((list) => list.map((a) => (a.id === updated.id ? updated : a)));
    setEditingAgentId(null);
  };

  const deleteAgent = (id: string) => {
    if (!confirm("Delete this agent?")) return;
    const filtered = agents.filter((a) => a.id !== id);
    setAgents(filtered);
    if (filtered.length > 0) {
      setSelectedAgentId(filtered[0].id);
    } else {
      setSelectedAgentId("");
    }
    // also remove phases referencing deleted agent
    setPhases((p) =>
      p.map((ph) => (ph.agentId === id ? { ...ph, agentId: null } : ph))
    );
    setEditingAgentId(null);
  };

  /* ----------------------- PHASE CRUD ----------------------- */

  const addPhase = () => {
    const newPhase: Phase = {
      id: uid("phase-"),
      title: "New Phase",
      type: "manual",
      agentId: null,
      instructions: "Edit instructions...",
    };
    setPhases((p) => [...p, newPhase]);
    setEditingPhaseId(newPhase.id);
  };

  const updatePhase = (updated: Phase) => {
    setPhases((list) => list.map((p) => (p.id === updated.id ? updated : p)));
    setEditingPhaseId(null);
  };

  const deletePhase = (id: string) => {
    if (!confirm("Delete this phase?")) return;
    setPhases((list) => list.filter((p) => p.id !== id));
    setEditingPhaseId(null);
  };

  const movePhase = (id: string, dir: "up" | "down") => {
    setPhases((list) => {
      const idx = list.findIndex((p) => p.id === id);
      const target = dir === "up" ? idx - 1 : idx + 1;
      if (idx === -1 || target < 0 || target >= list.length) return list;
      const copy = [...list];
      [copy[idx], copy[target]] = [copy[target], copy[idx]];
      return copy;
    });
  };

  /* ----------------------- Subcomponents ----------------------- */

  // Sidebar with agents list + add/reset buttons
  const LeftSidebar: React.FC = () => (
    <div className="w-72 bg-white border-r p-4 overflow-y-auto flex flex-col h-full">
      <h3 className="text-xl font-semibold mb-4">Agents</h3>

      <div className="flex flex-col space-y-2 flex-1">
        {agents.map((ag) => (
          <button
            key={ag.id}
            type="button"
            onMouseDown={(e) => e.preventDefault()} // prevent focus-steal when clicking list
            onClick={() => selectAgent(ag.id)}
            className={`p-3 rounded text-left border ${
              selectedAgentId === ag.id
                ? "bg-blue-100 border-blue-600"
                : "hover:bg-gray-100 border-transparent"
            }`}
          >
            <div className="font-medium text-sm">{ag.name}</div>
            <div className="text-xs text-gray-500">
              {ag.description.slice(0, 45)}...
            </div>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t space-y-2">
        <button
          type="button"
          onClick={addAgent}
          className="w-full px-3 py-2 bg-blue-600 text-white rounded"
        >
          Add Agent
        </button>

        <button
          type="button"
          onClick={resetAgents}
          className="w-full px-3 py-2 border rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );

  /* ----------------------- Agent Editor (local-state based) -----------------------
     Using a dedicated component with local state while editing prevents the parent
     re-renders from replacing the input DOM and losing focus. When user saves,
     we push the updated agent back to parent state via updateAgent().
  ------------------------------------------------------------------------------ */
  const AgentEditor: React.FC = () => {
    if (!selectedAgent)
      return <div className="flex-1 p-6">No agent selected.</div>;

    // If not editing, show read-only view with an Edit/Delete button
    if (editingAgentId !== selectedAgent.id) {
      return (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="flex justify-between mb-4">
            <div className="w-[70%]">
              <h2 className="text-2xl font-semibold">{selectedAgent.name}</h2>
              <p className="text-sm text-gray-600">
                {selectedAgent.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setEditingAgentId(selectedAgent.id)}
                className="px-4 py-1 border rounded"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteAgent(selectedAgent.id)}
                className="px-3 py-1 border rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="space-y-4 w-[70%]">
            <div>
              <label className="text-sm font-medium">Agent Name</label>
              <div className="mt-1 p-2 border rounded bg-gray-50">
                {selectedAgent.name}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <div className="mt-1 p-2 border rounded bg-gray-50">
                {selectedAgent.description}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">
                Predefined Instructions
              </label>
              <div className="mt-1 p-2 border rounded bg-gray-50 whitespace-pre-wrap">
                {selectedAgent.instructions}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // EDIT MODE: use a local draft to keep typing stable
    return (
      <AgentEditorForm
        agent={selectedAgent}
        onSave={updateAgent}
        onCancel={() => setEditingAgentId(null)}
      />
    );
  };

  // Agent editing form component (local state)
  const AgentEditorForm: React.FC<{
    agent: Agent;
    onSave: (a: Agent) => void;
    onCancel: () => void;
  }> = ({ agent, onSave, onCancel }) => {
    const [local, setLocal] = useState<Agent>(() => ({ ...agent }));

    // If the selected agent changes (switching between agents), reset local state
    useEffect(() => {
      setLocal({ ...agent });
    }, [agent]);

    return (
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between mb-4">
          <div className="w-[70%]">
            <h2 className="text-2xl font-semibold">{local.name}</h2>
            <p className="text-sm text-gray-600">{local.description}</p>
          </div>

          <div className="space-x-2">
            <button
              type="button"
              onClick={() => onSave(local)}
              className="px-4 py-1 bg-blue-600 text-white rounded"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-1 border rounded"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="space-y-5 w-[70%]">
          <div>
            <label className="text-sm font-medium">Agent Name</label>
            <input
              autoComplete="off"
              value={local.name}
              onChange={(e) =>
                setLocal((s) => ({ ...s, name: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={local.description}
              onChange={(e) =>
                setLocal((s) => ({ ...s, description: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mt-1 h-24"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Predefined Instructions
            </label>
            <textarea
              value={local.instructions}
              onChange={(e) =>
                setLocal((s) => ({ ...s, instructions: e.target.value }))
              }
              className="w-full border px-3 py-2 rounded mt-1 h-36"
            />
          </div>
        </div>
      </div>
    );
  };

  /* ----------------------- Phases Manager (only for Agent 4) ----------------------- */

  const PhasesManager: React.FC = () => {
    if (selectedAgentId !== "agent-4") return null;

    return (
      <div className="w-96 bg-white border-l p-4 overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Job Listing — Phases</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addPhase}
              className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            >
              Add Phase
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {phases.map((phase, idx) => (
            <div key={phase.id} className="border rounded p-3 bg-white">
              {/* If this phase is in edit mode, mount an editor form with local state */}
              {editingPhaseId === phase.id ? (
                <PhaseEditorForm
                  phase={phase}
                  agents={agents}
                  onSave={(p) => updatePhase(p)}
                  onCancel={() => setEditingPhaseId(null)}
                />
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">
                          {idx + 1}. {phase.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {phase.type === "agent"
                            ? `Agent: ${
                                agents.find((a) => a.id === phase.agentId)
                                  ?.name ?? "—"
                              }`
                            : "Manual"}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-sm text-gray-700">
                      {phase.instructions}
                    </div>
                  </div>

                  <div className="flex flex-col ml-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => setEditingPhaseId(phase.id)}
                      className="px-2 py-1 border rounded text-xs"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhase(phase.id, "up")}
                      className="px-2 py-1 border rounded text-xs"
                      disabled={idx === 0}
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => movePhase(phase.id, "down")}
                      className="px-2 py-1 border rounded text-xs"
                      disabled={idx === phases.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => deletePhase(phase.id)}
                      className="px-2 py-1 border rounded text-xs text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Editor form for phases (local state)
  const PhaseEditorForm: React.FC<{
    phase: Phase;
    agents: Agent[];
    onSave: (p: Phase) => void;
    onCancel: () => void;
  }> = ({ phase, agents, onSave, onCancel }) => {
    const [local, setLocal] = useState<Phase>({ ...phase });

    useEffect(() => {
      setLocal({ ...phase });
    }, [phase]);

    return (
      <div className="w-full">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <input
              value={local.title}
              onChange={(e) =>
                setLocal((s) => ({ ...s, title: e.target.value }))
              }
              className="border px-2 py-1 rounded w-full text-sm"
            />

            <select
              value={local.type}
              onChange={(e) => {
                const t = e.target.value as PhaseType;
                setLocal((s) => ({
                  ...s,
                  type: t,
                  agentId: t === "agent" ? "agent-4" : null,
                }));
              }}
              className="border px-2 py-1 rounded text-xs mt-2"
            >
              <option value="agent">Agent</option>
              <option value="manual">Manual</option>
            </select>

            {/* NOTE: user requested to remove the "another dropdown entirely" — so we only keep the type selector.
                Agent selection is forced to agent-4 when type === "agent" as per requirements. */}

            <textarea
              value={local.instructions}
              onChange={(e) =>
                setLocal((s) => ({ ...s, instructions: e.target.value }))
              }
              className="border w-full mt-3 h-24 px-3 py-2 rounded text-sm"
            />
          </div>

          <div className="flex flex-col ml-2 space-y-1">
            <button
              type="button"
              onClick={() => onSave(local)}
              className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
            >
              Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-2 py-1 border rounded text-xs"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ----------------------- Layout ----------------------- */

  return (
    <div className="h-screen w-full bg-gray-100 font-['IBM Plex Sans']">
      <div className="h-full flex">
        <LeftSidebar />
        <AgentEditor />
        <PhasesManager />
      </div>
    </div>
  );
};

export default Configuration;
