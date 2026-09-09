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
  Layers,
  Terminal,
} from 'lucide-react';
import { springPresets } from '../../lib/springs';
import { sound } from '../../lib/sound';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  actions?: Array<{ label: string; action: () => void; icon?: any }>;
}

const INITIAL_MESSAGE: ChatMessage = {
  id: 'init-1',
  sender: 'ai',
  text: "Hello! I am Naveen Bishnoi's Systems AI Copilot.\n\nAsk me anything about his telematics architecture at KRONE Agriculture, the Ultron multi-agent swarm, his POSIX C storage engine, or how to collaborate directly.",
};

const SUGGESTED_QUERIES = [
  { label: '🚜 KRONE Agriculture IoT', query: 'What did Naveen build at KRONE Agriculture?' },
  { label: '🤖 Ultron Multi-Agent Swarm', query: 'Tell me about the Ultron AI swarm architecture' },
  { label: '💾 GAMS POSIX C Storage', query: 'How does the GAMS POSIX C engine guarantee zero corruption?' },
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
  const [soundActive, setSoundActive] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSoundActive(sound.isEnabled());
  }, []);

  const toggleSound = () => {
    const next = sound.toggle();
    setSoundActive(next);
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
      sound.playChirp();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const getAiResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();

    if (q.includes('krone') || q.includes('agriculture') || q.includes('iot') || q.includes('telematics') || q.includes('tractor')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "At **KRONE Agriculture India**, Naveen is a Software Architect designing high-throughput telematics systems for industrial harvesters and tractors.\n\nKey accomplishments:\n• Engineered a 50Hz CAN-bus (J1939) edge ingestion daemon with zero packet loss.\n• Implemented local crash-proof WAL buffering that preserves critical metrics through intermittent rural cellular deadzones.\n• Deterministic offline-to-cloud sync pipeline handling 50,000+ deployed field units.",
        actions: [
          {
            label: 'View KRONE Project',
            action: () => {
              window.location.href = '/projects/krone-iot';
              setIsOpen(false);
            },
            icon: Radio,
          },
        ],
      };
    }

    if (q.includes('ultron') || q.includes('swarm') || q.includes('agent') || q.includes('dag')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "**Ultron** is an autonomous multi-agent orchestration engine.\n\nArchitectural pillars:\n• Byzantine Fault Tolerant (BFT) consensus to prevent hallucinations and stochastic prompt loops.\n• Topological DAG task decomposition via Kahn's algorithm for deterministic parallel execution.\n• Abstract Syntax Tree (AST) taint tracking to enforce security boundaries prior to synthesis.",
        actions: [
          {
            label: 'Explore Projects',
            action: () => {
              window.location.href = '/projects';
              setIsOpen(false);
            },
            icon: Cpu,
          },
        ],
      };
    }

    if (q.includes('gams') || q.includes('posix') || q.includes('c engine') || q.includes('storage') || q.includes('corruption')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "**GAMS** is a POSIX-compliant deterministic local storage engine written in pure C.\n\nIt features:\n• Atomic inode replacement using Linux `renameat2(RENAME_EXCHANGE)` to prevent torn writes.\n• Double-checksummed Write-Ahead Logging (WAL) with CRC32C verification.\n• Zero memory allocations in critical write paths, verified valgrind leak-free.",
        actions: [
          {
            label: 'Read System Specs',
            action: () => {
              window.location.href = '/projects';
              setIsOpen(false);
            },
            icon: Terminal,
          },
        ],
      };
    }

    if (q.includes('stack') || q.includes('skill') || q.includes('language') || q.includes('tech') || q.includes('rust') || q.includes('c++')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Naveen's production stack spans:\n\n• **Low-Level & Embedded:** POSIX C, Rust, C++, Linux IPC, CAN-Bus (J1939)\n• **Distributed Systems:** Python (FastAPI), Go, TypeScript, Node.js, gRPC\n• **Storage & Databases:** PostgreSQL, Redis, WAL storage engines, SQLite\n• **Web & Interface:** Astro, React 19, TailwindCSS, Three.js, GSAP\n• **Cloud & DevOps:** Docker, Kubernetes, Linux systemd, GitHub Actions",
        actions: [
          {
            label: 'Skills Bento',
            action: () => {
              const el = document.getElementById('skills');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = '/#skills';
              }
              setIsOpen(false);
            },
            icon: Layers,
          },
        ],
      };
    }

    if (q.includes('resume') || q.includes('cv') || q.includes('background') || q.includes('experience') || q.includes('education') || q.includes('degree')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "Naveen Bishnoi is a Software Architect with 3+ years of production experience in agricultural telematics and distributed platforms. He holds a Bachelor of Computer Applications (BCA Honors) with Distinction.\n\nYou can view his live interactive resume or download the verified PDF.",
        actions: [
          {
            label: 'View Web Resume',
            action: () => {
              window.location.href = '/resume';
              setIsOpen(false);
            },
            icon: FileText,
          },
          {
            label: 'Download PDF',
            action: () => {
              window.open('/Naveen_Bishnoi_Resume.pdf', '_blank');
            },
            icon: FileText,
          },
        ],
      };
    }

    if (q.includes('contact') || q.includes('hire') || q.includes('email') || q.includes('message') || q.includes('phone') || q.includes('reach')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: "You can reach Naveen directly:\n\n• **Email:** 0029bishnoinaveen@gmail.com\n• **Location:** India (IST · UTC+5:30)\n• **Availability:** Open for architectural consulting, enterprise systems, and high-impact software roles.",
        actions: [
          {
            label: copied ? 'Copied to Clipboard!' : 'Copy Email Address',
            action: handleCopyEmail,
            icon: copied ? Check : Copy,
          },
          {
            label: 'LinkedIn Profile',
            action: () => window.open('https://linkedin.com/in/naveen-bishnoi', '_blank'),
            icon: ExternalLink,
          },
        ],
      };
    }

    // Default Fallback
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: "Naveen specializes in deterministic systems engineering, distributed IoT telematics, and autonomous multi-agent swarms. Would you like to explore his work at KRONE Agriculture, inspect his Ultron architecture, or download his resume?",
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
    sound.playClick();

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
      sound.playPop();
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(inputText);
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="fixed bottom-6 right-6 z-40">
        <motion.button
          type="button"
          onClick={() => {
            sound.playClick();
            setIsOpen((prev) => !prev);
          }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          transition={springPresets.snappy}
          aria-label={isOpen ? 'Close Naveen AI' : undefined}
          aria-expanded={isOpen}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-white/95 dark:bg-[#0f1424]/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] group min-h-[44px]"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--color-accent)] to-purple-600 text-white shadow-sm">
            <Bot className="w-4 h-4" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0f1424]" />
          </div>

          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold text-[var(--color-text-primary)] leading-none">
              Naveen AI
            </span>
            <span className="text-[10px] font-mono text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Copilot Ready
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
            role="region"
            aria-label="Naveen AI Assistant Conversation"
            className="fixed bottom-22 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[580px] h-[80vh] flex flex-col rounded-[28px] bg-white/95 dark:bg-[#0c0f1d]/95 backdrop-blur-3xl border border-black/10 dark:border-white/15 shadow-[0_24px_60px_rgba(0,0,0,0.16)] dark:shadow-[0_24px_60px_rgba(0,0,0,0.7)] overflow-hidden"
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
                    Architect Knowledge Base · v3.3
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleSound}
                  title={soundActive ? 'Mute Sound' : 'Enable Sound'}
                  aria-label={soundActive ? 'Mute Sound' : 'Enable Sound'}
                  className="p-1.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsOpen(false);
                  }}
                  title="Close Assistant"
                  aria-label="Close Assistant"
                  className="p-1.5 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div
              role="log"
              aria-live="polite"
              className="flex-1 p-4 overflow-y-auto flex flex-col gap-3.5 text-xs"
            >
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
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[var(--color-accent)] text-white font-medium rounded-tr-xs shadow-sm'
                        : 'bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-primary)] rounded-tl-xs border border-black/[0.06] dark:border-white/10'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {/* Interactive Action Buttons */}
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-black/10 dark:border-white/10 flex flex-wrap gap-1.5">
                        {msg.actions.map((act, i) => {
                          const Icon = act.icon;
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => {
                                sound.playClick();
                                act.action();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-black/40 border border-black/10 dark:border-white/15 text-[11px] font-semibold text-[var(--color-accent)] hover:opacity-85 transition-opacity cursor-pointer shadow-xs min-h-[32px]"
                            >
                              {Icon && <Icon className="w-3.5 h-3.5" />}
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
                  <span>Synthesizing response...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Inquiry Chips */}
            <div className="px-4 py-2 border-t border-black/[0.06] dark:border-white/8 bg-black/[0.01] dark:bg-white/[0.01]">
              <p className="text-[10px] font-mono text-[var(--color-text-muted)] uppercase tracking-wider mb-1.5">
                Quick Inquiries:
              </p>
              <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {SUGGESTED_QUERIES.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendQuery(item.query)}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium bg-black/[0.04] dark:bg-white/[0.06] hover:bg-black/[0.08] dark:hover:bg-white/[0.1] text-[var(--color-text-secondary)] transition-colors cursor-pointer border border-black/[0.05] dark:border-white/10 min-h-[28px]"
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
                aria-label="Message to Naveen AI"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-black/40 border border-black/10 dark:border-white/15 text-xs text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                aria-label="Send message"
                className="p-2.5 rounded-xl bg-[var(--color-accent)] hover:bg-[#0077ED] disabled:opacity-40 text-white transition-all cursor-pointer shadow-sm min-h-[38px] min-w-[38px] flex items-center justify-center"
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
