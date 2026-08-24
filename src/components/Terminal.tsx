import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playHoverSound, playClickSound } from '../utils/sound';

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<{ type: 'input' | 'output'; text: string }[]>([
    { type: 'output', text: 'Naveen Bishnoi System Terminal v1.0.0' },
    { type: 'output', text: 'Type "help" to see available commands.' }
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        if (!isOpen) playHoverSound();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    playClickSound();
    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'input' as const, text: `guest@naveen:~$ ${input}` }];
    
    switch (cmd) {
      case 'help':
        newHistory.push({ type: 'output', text: 'Available commands: whoami, skills, clear, sudo hire naveen, exit' });
        break;
      case 'whoami':
        newHistory.push({ type: 'output', text: 'A Software Architect & AI Engineer who builds distributed systems that don\'t break.' });
        break;
      case 'skills':
        newHistory.push({ type: 'output', text: 'Agentic AI, Autonomous Looping Prompts, Graphical Engineering, Prompt Architecture, Distributed Systems, Kafka, React.' });
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'sudo hire naveen':
        newHistory.push({ type: 'output', text: 'Access Granted. Redirecting to mailto:0029bishnoinaveen@gmail.com ...' });
        setTimeout(() => {
          window.location.href = 'mailto:0029bishnoinaveen@gmail.com';
        }, 1500);
        break;
      case 'exit':
        setIsOpen(false);
        break;
      default:
        newHistory.push({ type: 'output', text: `command not found: ${cmd}` });
    }
    
    setHistory(newHistory);
    setInput('');
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setIsOpen(false)}
        >
          <div 
            className="w-full max-w-2xl bg-[#09090b] border border-white/20 rounded-xl shadow-2xl overflow-hidden font-mono flex flex-col h-[60vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mac Window Header */}
            <div className="h-10 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 cursor-pointer" onClick={() => setIsOpen(false)}></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="flex-1 text-center text-xs text-zinc-500 font-bold tracking-widest uppercase">root@naveen_sys</div>
            </div>
            
            {/* Terminal Body */}
            <div className="flex-1 overflow-y-auto p-4 text-sm text-zinc-300 flex flex-col gap-2" onClick={() => inputRef.current?.focus()}>
              {history.map((line, i) => (
                <div key={i} className={`${line.type === 'input' ? 'text-emerald-400' : 'text-zinc-400'} whitespace-pre-wrap`}>
                  {line.text}
                </div>
              ))}
              
              <form onSubmit={handleCommand} className="flex items-center gap-2 mt-2">
                <span className="text-emerald-400">guest@naveen:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-1 bg-transparent border-none outline-none text-zinc-300"
                  autoFocus
                  autoComplete="off"
                  spellCheck="false"
                />
              </form>
              <div ref={endRef} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    
    {/* Mobile Terminal Trigger */}
    {!isOpen && (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[89000] md:hidden w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-zinc-400 font-mono text-xs shadow-2xl hover:bg-white/10 transition-colors"
        aria-label="Open Terminal"
      >
        [ _ ]
      </button>
    )}
    </>
  );
}
