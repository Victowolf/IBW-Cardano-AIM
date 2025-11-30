import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const Chatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Drag State
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const windowRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // Focus input
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 120);
  }, [open]);

  // Mouse Events (dragging)
  const onMouseDown = (e: React.MouseEvent) => {
    if (!windowRef.current) return;
    setDragging(true);
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPos({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    }
  };

  const onMouseUp = () => setDragging(false);

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [dragging]);

  // Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      text: input.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `a-${Date.now()}`,
        role: "assistant",
        text: data.response ?? "No response from chatbot.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          text: "⚠️ Error: Could not reach chatbot.",
        },
      ]);
    }

    setLoading(false);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !loading) sendMessage();
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen((s) => !s)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-xl flex items-center justify-center text-white transition"
      >
        {open ? <X size={26} /> : <MessageCircle size={32} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          ref={windowRef}
          style={{
            width: "600px",
            height: "75vh",
            transform: `translate(${pos.x}px, ${pos.y}px)`,
          }}
          className="fixed bottom-24 right-6 z-50 bg-white rounded-xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden"
        >
          {/* Header - draggable */}
          <div
            onMouseDown={onMouseDown}
            className="px-5 py-3 bg-gray-100 border-b flex justify-between items-center cursor-grab active:cursor-grabbing select-none"
          >
            <h3 className="font-semibold text-gray-800">Orbit Assistant</h3>

            <button
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-gray-50"
          >
            {messages.length === 0 && (
              <p className="text-sm text-gray-500">
                Hello! I’m Orbit Assistant. Ask me anything about the dashboard,
                jobs, HR, analytics, or workflow!
              </p>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${
                  m.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-4 py-2 text-sm rounded-xl max-w-[70%] shadow ${
                    m.role === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white text-gray-900 border rounded-bl-none"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">Orbit is typing…</div>
            )}
          </div>

          {/* Input */}
          <div className="px-4 py-3 border-t bg-white">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-60"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
