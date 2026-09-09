import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Briefcase,
  FileText,
  Terminal,
  Cpu,
  Mail,
  Copy,
  ExternalLink,
  SunMoon,
  Home,
  Check,
  X,
  Layers
} from 'lucide-react';
import { sound } from '../../lib/sound';

interface CommandItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'Navigation' | 'Case Studies' | 'Actions';
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const newTheme = isDark ? 'light' : 'dark';
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('naveen-bishnoi-theme', newTheme);
    onClose();
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('0029bishnoinaveen@gmail.com');
    sound.playChirp();
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 900);
  };

  const navigateTo = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.href = `/${href}`;
      }
    } else {
      window.location.href = href;
    }
    onClose();
  };

  const commands: CommandItem[] = [
    {
      id: 'home',
      title: 'Command Center (Home)',
      description: 'Return to portfolio root overview',
      icon: <Home className="w-4 h-4 text-blue-500" />,
      category: 'Navigation',
      action: () => navigateTo('/'),
      shortcut: 'H',
    },
    {
      id: 'projects',
      title: 'Projects Gallery',
      description: 'Explore all 4 production distributed systems',
      icon: <Layers className="w-4 h-4 text-indigo-500" />,
      category: 'Navigation',
      action: () => navigateTo('/projects'),
      shortcut: 'P',
    },
    {
      id: 'krone',
      title: 'KRONE Telematics Case Study',
      description: '50k+ machines, CAN bus telemetry, sub-200ms latency',
      icon: <Cpu className="w-4 h-4 text-emerald-500" />,
      category: 'Case Studies',
      action: () => navigateTo('/projects/krone-iot'),
      shortcut: 'K',
    },
    {
      id: 'experience',
      title: 'Experience Timeline',
      description: 'KRONE Agriculture Software Engineer & Systems Architect',
      icon: <Briefcase className="w-4 h-4 text-amber-500" />,
      category: 'Navigation',
      action: () => navigateTo('/#experience'),
      shortcut: 'E',
    },
    {
      id: 'resume',
      title: 'Executive Resume',
      description: 'Printable credentials, BCA honors, and verified proof',
      icon: <FileText className="w-4 h-4 text-purple-500" />,
      category: 'Navigation',
      action: () => navigateTo('/resume'),
      shortcut: 'R',
    },
    {
      id: 'lab',
      title: 'Interactive 3D Lab Suite',
      description: 'Real-time telemetry, memory graphs, and AST diffs',
      icon: <Terminal className="w-4 h-4 text-cyan-500" />,
      category: 'Navigation',
      action: () => navigateTo('/lab'),
      shortcut: 'L',
    },
    {
      id: 'copy-email',
      title: copied ? 'Copied Email to Clipboard!' : 'Copy Direct Email',
      description: '0029bishnoinaveen@gmail.com',
      icon: copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-neutral-400" />,
      category: 'Actions',
      action: copyEmail,
      shortcut: 'C',
    },
    {
      id: 'toggle-theme',
      title: 'Toggle Dark / Light Theme',
      description: 'Switch between Apple Obsidian Dark and Ceramic Light',
      icon: <SunMoon className="w-4 h-4 text-orange-400" />,
      category: 'Actions',
      action: toggleTheme,
      shortcut: 'T',
    },
    {
      id: 'github',
      title: 'GitHub Profile',
      description: 'github.com/BishnoiNaveen',
      icon: <ExternalLink className="w-4 h-4 text-neutral-400" />,
      category: 'Actions',
      action: () => {
        window.open('https://github.com/BishnoiNaveen', '_blank', 'noopener,noreferrer');
        onClose();
      },
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Network',
      description: 'linkedin.com/in/naveen-bishnoi',
      icon: <ExternalLink className="w-4 h-4 text-blue-400" />,
      category: 'Actions',
      action: () => {
        window.open('https://linkedin.com/in/naveen-bishnoi', '_blank', 'noopener,noreferrer');
        onClose();
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.description.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette on Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger handled by parent if closed
        }
      }

      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        sound.playClick();
        setSelectedIndex((prev) => (prev + 1) % (filteredCommands.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        sound.playClick();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % (filteredCommands.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        sound.playPop();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          className="fixed inset-0 z-[999] flex items-start justify-center pt-[15vh] px-4 sm:px-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md cursor-pointer"
          />

          {/* Palette Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative z-10 w-full max-w-xl rounded-2xl bg-white/95 dark:bg-[#0E121E]/95 backdrop-blur-2xl border border-black/10 dark:border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.2)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden pointer-events-auto flex flex-col"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-black/[0.08] dark:border-white/10">
              <Search className="w-5 h-5 text-[var(--color-text-secondary)] shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command, project, or destination..."
                className="w-full bg-transparent text-sm sm:text-base text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none font-medium"
              />
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/[0.05] dark:bg-white/[0.1] text-[var(--color-text-secondary)] border border-black/[0.05] dark:border-white/10">
                ESC
              </span>
            </div>

            {/* Results List */}
            <div className="max-h-[60vh] overflow-y-auto p-2 divide-y divide-black/[0.04] dark:divide-white/[0.04]">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-sm text-[var(--color-text-secondary)]">
                  No matching commands found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                filteredCommands.map((cmd, idx) => {
                  const isSelected = idx === selectedIndex;
                  return (
                    <div
                      key={cmd.id}
                      onClick={cmd.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[var(--color-accent)] text-white'
                          : 'text-[var(--color-text-primary)] hover:bg-black/[0.03] dark:hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`p-1.5 rounded-lg shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-black/[0.04] dark:bg-white/[0.06]'
                          }`}
                        >
                          {cmd.icon}
                        </div>
                        <div className="min-w-0 truncate">
                          <div className="text-xs sm:text-sm font-semibold truncate">
                            {cmd.title}
                          </div>
                          <div
                            className={`text-[11px] truncate ${
                              isSelected
                                ? 'text-white/80'
                                : 'text-[var(--color-text-secondary)]'
                            }`}
                          >
                            {cmd.description}
                          </div>
                        </div>
                      </div>

                      {cmd.shortcut && (
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-black/[0.04] dark:bg-white/[0.06] text-[var(--color-text-secondary)] border border-black/[0.05] dark:border-white/10'
                          }`}
                        >
                          {cmd.shortcut}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Hints */}
            <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.02] border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between text-[11px] text-[var(--color-text-secondary)] font-mono">
              <div className="flex items-center gap-2">
                <span>↑↓ navigate</span>
                <span>·</span>
                <span>↵ select</span>
              </div>
              <span className="hidden sm:inline">Naveen Bishnoi Architecture OS</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
