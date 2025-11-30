/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Settings,
  LogOut,
  User as UserIcon,
  Pencil,
  Check,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OverviewTab from "@/components/tabs/Overveiw";
import AgentsTab from "@/components/tabs/Agents";
import ReportsTab from "@/components/tabs/Reports";

type Role = "HR" | "Legal" | "Admin" | null;

const Dashboard: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>(null);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  // Move displayName to parent so it persists reliably
  const [displayName, setDisplayName] = useState<string>(() => {
    return localStorage.getItem("userName") || "Peter";
  });

  // Resolve role from navigation state or localStorage
  useEffect(() => {
    const stateRole = (location.state as any)?.role as Role | undefined;
    const stored = (localStorage.getItem("userRole") as Role) || null;

    if (stateRole) {
      setRole(stateRole);
      localStorage.setItem("userRole", stateRole);
    } else if (stored) {
      setRole(stored);
    } else {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect non-HR users away
  useEffect(() => {
    if (role && role !== "HR") {
      navigate("/login", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  // HR-only tabs
  const availableTabs = useMemo(() => ["Overview", "Agents", "Reports"], []);

  // Initialize activeTab when role is HR
  useEffect(() => {
    if (role === "HR" && availableTabs.length > 0) {
      setActiveTab((prev) =>
        prev && availableTabs.includes(prev) ? prev : availableTabs[0]
      );
    }
  }, [role, availableTabs]);

  const handleTabChange = (tab: string) => {
    if (!availableTabs.includes(tab)) return;
    setActiveTab(tab);
  };

  const renderTab = () => {
    if (!activeTab) return null;
    switch (activeTab) {
      case "Overview":
        return <OverviewTab />;
      case "Agents":
        return <AgentsTab />;
      case "Reports":
        return <ReportsTab />;
      default:
        return null;
    }
  };

  // ---------- ProfileMenu component (local) ----------
  type ProfileMenuProps = {
    displayName: string;
    setDisplayName: (name: string) => void;
  };

  const ProfileMenu: React.FC<ProfileMenuProps> = ({
    displayName,
    setDisplayName,
  }) => {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(displayName);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const buttonRef = useRef<HTMLButtonElement | null>(null);

    // keep draft in sync when displayName changes externally
    useEffect(() => {
      setDraft(displayName);
    }, [displayName]);

    // close on outside click
    useEffect(() => {
      const onDocClick = (e: MouseEvent) => {
        if (!open) return;
        const target = e.target as Node;
        if (
          menuRef.current &&
          !menuRef.current.contains(target) &&
          buttonRef.current &&
          !buttonRef.current.contains(target)
        ) {
          setOpen(false);
          setEditing(false);
          setDraft(displayName);
        }
      };
      document.addEventListener("click", onDocClick);
      return () => document.removeEventListener("click", onDocClick);
    }, [open, displayName]);

    // keyboard: close on Escape
    useEffect(() => {
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setOpen(false);
          setEditing(false);
          setDraft(displayName);
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [displayName]);

    const startEdit = () => {
      setDraft(displayName);
      setEditing(true);
    };

    const save = () => {
      const trimmed = draft.trim();
      if (!trimmed) return; // do not allow empty
      setDisplayName(trimmed);
      localStorage.setItem("userName", trimmed);
      setEditing(false);
      setOpen(false);
    };

    const cancel = () => {
      setEditing(false);
      setDraft(displayName);
    };

    const logout = () => {
      localStorage.removeItem("userRole");
      navigate("/login");
    };

    const openSettings = () => {
      setOpen(false);
      navigate("/configuration");
    };

    return (
      <div className="relative" ref={menuRef}>
        <button
          ref={buttonRef}
          onClick={() => setOpen((s) => !s)}
          className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center shadow-md focus:outline-none"
          aria-label="Open profile menu"
          title={displayName}
        >
          <span className="font-medium text-sm">
            {displayName
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase() || "P"}
          </span>
        </button>

        {open && (
          <div
            className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg border border-gray-200 z-50"
            style={{ minWidth: 220 }}
          >
            <div className="p-3 border-b border-gray-100">
              {!editing ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-700">
                      <UserIcon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">
                        {displayName}
                      </div>
                      <div className="text-xs text-slate-500">HR</div>
                    </div>
                  </div>

                  <button
                    onClick={startEdit}
                    className="p-1 rounded hover:bg-gray-100"
                    title="Edit name"
                  >
                    <Pencil size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <input
                    autoFocus
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    className="w-full border rounded px-2 py-1 text-sm"
                    aria-label="Edit display name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        save();
                      } else if (e.key === "Escape") {
                        cancel();
                      }
                    }}
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancel}
                      className="text-sm px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-2"
                    >
                      <X size={14} /> Cancel
                    </button>
                    <button
                      onClick={save}
                      className="text-sm px-2 py-1 rounded bg-blue-600 text-white flex items-center gap-2"
                    >
                      <Check size={14} /> Save
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-2">
              <button
                onClick={openSettings}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-50"
              >
                <Settings size={16} />
                <span>Configuration</span>
              </button>

              <button
                onClick={logout}
                className="w-full mt-1 flex items-center gap-2 px-3 py-2 text-sm rounded hover:bg-gray-50 text-rose-600"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Block until authorized
  if (!role) return null;
  if (role !== "HR") return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        variant="dashboard"
        activeTab={activeTab || undefined}
        onTabChange={(tab: string) => handleTabChange(tab)}
        availableTabs={availableTabs}
        profileNode={
          <ProfileMenu
            displayName={displayName}
            setDisplayName={setDisplayName}
          />
        }
      />

      <main className="bg-secondary/20 flex-1">
        <div className="px-4 py-6">{renderTab()}</div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
