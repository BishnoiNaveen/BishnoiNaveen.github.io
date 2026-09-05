import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Volume2,
  VolumeX,
  Radio,
  Cpu,
  Mail,
} from 'lucide-react';
import { springPresets } from '../../lib/springs';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actions?: Array<{ label: string; action: () => void; icon?: any }>;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  sender: 'ai',
  text: "Hello! I'm Naveen's AI Copilot. Ask me anything about his systems architecture at KRONE Agriculture, the Ultron multi-agent swarm, his POSIX memory invariants, or how to collaborate.",
};

const SUGGESTED_QUERIES = [
  { label: '🌾 KRONE Agriculture IoT', query: 'What did Naveen build at KRONE Agriculture?' },
  { label: '🤖 Ultron Multi-Agent Swarm', query: 'Tell me about the Ultron AI swarm architecture' },
  { label: '⚙️ Technical Stack', query: 'What is Naveen’s technical stack and expertise?' },
  { label: '📄 Resume & Background', query: 'Where can I see his resume and verified experience?' },
  { label: '📬 Contact & Hire', query: 'How can I get in touch or hire Naveen?' },
];

export default function NaveenAssistant() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synthesized Apple-style tactile click sound
  const playClickSound = (pitch = 800) => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('0029bishnoinaveen@gmail.com');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getAiResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();

    if (q.includes('krone') || q.includes('agriculture') || q.includes('iot') || q.includes('telematics')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "At **KRONE Agriculture India**, Naveen is a Software Architect designing high-throughput telematics systems for industrial harvesters and tractors. He architected a 50Hz CAN-bus edge ingestion pipeline with zero packet drop, local WAL buffering, and deterministic offline-to-cloud synchronization.",
        actions: [
          {
            label: 'View KRONE Project',
            action: () => {
              const el = document.getElementById('work');
              el?.scrollIntoView({ behavior: 'smooth' });
              setIsOpen(false);
            },
            icon: Radio,
          },
        ],
      };
    }

    if (q.includes('ultron') || q.includes('agent') || q.includes('swarm') || q.includes('ai')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "**Ultron** is an autonomous multi-agent orchestration engine. Naveen architected it around Byzantine Fault Tolerant (BFT) consensus to eliminate stochastic prompt loops. It features Kahn topological DAG task resolution, Abstract Syntax Tree (AST) taint tracking, and automated rollback checkpoints.",
        actions: [
          {
            label: 'Inspect Architecture',
            action: () => {
              const el = document.getElementById('lab');
              el?.scrollIntoView({ behavior: 'smooth' });
              setIsOpen(false);
            },
            icon: Cpu,
          },
        ],
      };
    }

    if (q.includes('stack') || q.includes('skill') || q.includes('language') || q.includes('tech') || q.includes('rust') || q.includes('c++')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Naveen's primary engineering stack spans:\n\n• **Low-Level Systems:** POSIX C, Rust, C++\n• **Distributed Platforms:** Python (FastAPI), Go, TypeScript, Node.js\n• **Protocols & Data:** CAN Bus (J1939), gRPC, WebSockets, Redis, PostgreSQL\n• **Frontend & Visual:** React 19, Astro, TailwindCSS, Three.js, GSAP\n• **AI Engineering:** LangChain, PyTorch, Multi-Agent BFT Consensus",
        actions: [
          {
            label: 'Explore Skills Bento',
            action: () => {
              const el = document.getElementById('skills');
              el?.scrollIntoView({ behavior: 'smooth' });
              setIsOpen(false);
            },
          },
        ],
      };
    }

    if (q.includes('resume') || q.includes('cv') || q.includes('background') || q.includes('experience')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Naveen Bishnoi brings 3+ years of production experience shipping 12+ distributed systems, kernel-level drivers, and AI automation platforms. You can download his verified resume PDF below.",
        actions: [
          {
            label: 'Download Resume PDF',
            action: () => {
              window.open('/Naveen_Bishnoi_Resume.pdf', '_blank');
            },
            icon: FileText,
          },
        ],
      };
    }

    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('message') || q.includes('reach')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "You can reach Naveen directly at **0029bishnoinaveen@gmail.com**. He is based in India (IST · UTC+5:30) and responds within 24 hours.",
        actions: [
          {
            label: copied ? 'Copied to Clipboard!' : 'Copy Email Address',
            action: handleCopyEmail,
            icon: copied ? Check : Copy,
          },
          {
            label: 'GitHub Profile',
            action: () => window.open('https://github.com/BishnoiNaveen', '_blank'),
            icon: ExternalLink,
          },
        ],
      };
    }

    // Default Fallback
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Naveen specializes in deterministic systems engineering, distributed IoT telematics, and autonomous multi-agent swarms. Would you like to explore his work at KRONE Agriculture, inspect his Ultron architecture, or download his resume?`,
      actions: [
        {
          label: 'KRONE Telematics',
          action: () => handleSendQuery('What did Naveen build at KRONE Agriculture?'),
        },
        {
          label: 'Download Resume',
          action: () => window.open('/Naveen_Bishnoi_Resume.pdf', '_blank'),
          icon: FileText,
        },
      ],
    };
  };

  const handleSendQuery = (queryText: string) => {
    if (!queryText.trim()) return;
    playClickSound(1000);

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const aiReply = getAiResponse(queryText);
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
      playClickSound(600);
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(inputText);
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          type="button"
          onClick={() => {
            playClickSound(900);
            setIsOpen((prev) => !prev);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          transition={springPresets.snappy}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white/90 dark:bg-[#0f1424]/90 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-purple-600 text-white shadow-sm">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          </div>

          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-extrabold text-[var(--color-text-primary)] tracking-tight">
              Ask Naveen AI
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Copilot Online
            </span>
          </div>
        </motion.button>
      </div>

      {/* Expandable Apple VisionOS Glass Drawer / Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={springPresets.snappy}
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[580px] h-[80vh] flex flex-col rounded-[28px] bg-white/92 dark:bg-[#0c0f1d]/95 backdrop-blur-3xl border border-black/10 dark:border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.15)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[var(--color-accent)] to-purple-600 flex items-center justify-center text-white shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text-primary)] leading-tight">
                    Naveen AI Assistant
                  </h4>
                  <p className="text-[10px] font-mono text-[var(--color-text-muted)]">
                    Architect Knowledge Base · v3.2
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setSoundEnabled((s) => !s)}
                  title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
                  className="p-1.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-6 h-6 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[var(--color-accent)] text-white font-medium rounded-tr-xs shadow-sm'
                        : 'bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-primary)] rounded-tl-xs border border-black/[0.06] dark:border-white/10'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Optional Interactive Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, i) => {
                          const Icon = act.icon;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                playClickSound(850);
                                act.action();
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-black/10 dark:border-white/15 text-[11px] font-semibold text-[var(--color-accent)] hover:opacity-85 transition-opacity cursor-pointer shadow-xs"
                            >
                              {Icon && <Icon className="w-3 h-3" />}
                              <span>{act.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 text-[var(--color-text-secondary)] flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] animate-ping" />
                  <span>Naveen AI is synthesizing response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="px-4 py-2 border-t border-black/[0.06] dark:border-white/8 bg-black/[0.01] dark:bg-white/[0.01]">
              <p className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                Suggested Inquiries:
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {SUGGESTED_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendQuery(item.query)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[var(--color-text-secondary)] transition-colors cursor-pointer border border-black/[0.05] dark:border-white/10"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-black/[0.08] dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.03] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about KRONE IoT, Ultron, or skills..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/30 border border-black/10 dark:border-white/15 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[#0077ED] disabled:opacity-40 text-white transition-all cursor-pointer shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
