import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Terminal as TerminalIcon, 
  X, 
  Maximize2, 
  Minimize2, 
  Terminal as LucideTerminal,
  Command,
  Bot,
  Cpu,
  Shield,
  Zap
} from 'lucide-react';
import { UIMode } from '../../src/types';

interface LogEntry {
  id: string;
  type: 'command' | 'output' | 'error' | 'system' | 'agent';
  content: string;
  timestamp: Date;
  agent?: string;
  source?: string;
}

interface TerminalProps {
  onClose: () => void;
  uiMode?: UIMode;
}

export const Terminal: React.FC<TerminalProps> = ({ onClose, uiMode }) => {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: '1', type: 'system', content: 'Viabhron OS Kernel [Version 1.0.42]', timestamp: new Date() },
    { id: '2', type: 'system', content: '(c) 2026 Viabhron Core Dev. All rights reserved.', timestamp: new Date() },
    { id: '3', type: 'system', content: 'Initializing Sovereign Substrate...', timestamp: new Date() },
    { id: '4', type: 'agent', content: 'Architect Agent online. Ready for kernel instructions.', timestamp: new Date(), agent: 'Architect' },
  ]);
  const [input, setInput] = useState('');
  const [isMaximized, setIsMaximized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleExecute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const command = input;
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type: 'command',
      content: command,
      timestamp: new Date()
    };

    setLogs(prev => [...prev, newLog]);
    setInput('');

    // Simulate system response
    setTimeout(() => {
      const response: LogEntry = {
        id: (Date.now() + 1).toString(),
        type: 'output',
        content: `Executing: ${command}...`,
        timestamp: new Date()
      };
      setLogs(prev => [...prev, response]);
      
      if (command.toLowerCase() === 'help') {
        setLogs(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          type: 'system',
          content: 'Available commands: help, status, agents, clear, exit, lockdown',
          timestamp: new Date()
        }]);
      } else if (command.toLowerCase() === 'clear') {
        setLogs([]);
      }
    }, 300);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 pointer-events-none`}
    >
      <div className={`w-full max-w-4xl h-full max-h-[600px] bg-[#050508] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto ${isMaximized ? 'max-w-none max-h-none !p-0' : ''}`}>
        {/* Terminal Header */}
        <div className="h-12 bg-gray-900/80 border-b border-white/5 flex items-center justify-between px-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <button onClick={onClose} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <button onClick={() => setIsMaximized(!isMaximized)} className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors" />
            </div>
            <div className="h-4 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-2">
              <LucideTerminal className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sovereign Terminal</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-[9px] font-bold uppercase tracking-tighter">
              <div className="flex items-center gap-1 text-green-400">
                <Cpu className="w-3 h-3" />
                <span>Kernel: Active</span>
              </div>
              <div className="flex items-center gap-1 text-blue-400">
                <Shield className="w-3 h-3" />
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1 text-orange-400">
                <Zap className="w-3 h-3" />
                <span>Latency: 12ms</span>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Output */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 font-mono text-sm space-y-2 no-scrollbar"
        >
          {logs.map((log) => (
            <div key={log.id} className="flex gap-3">
              <span className="text-gray-600 shrink-0 text-[10px] pt-1">
                [{log.timestamp.toLocaleTimeString([], { hour12: false })}]
              </span>
              <div className="flex-1">
                {log.type === 'command' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-500 font-bold">❯</span>
                    <span className="text-white font-medium">{log.content}</span>
                  </div>
                ) : log.type === 'error' ? (
                  <div className="text-red-400">
                    <span className="font-bold mr-2">ERROR:</span>
                    {log.content}
                  </div>
                ) : log.type === 'system' ? (
                  <div className="text-gray-500 italic">
                    {log.content}
                  </div>
                ) : log.type === 'agent' ? (
                  <div className="flex items-center gap-2">
                    <span className="text-purple-400 font-bold">[{log.agent}]</span>
                    <span className="text-gray-300">{log.content}</span>
                  </div>
                ) : (
                  <div className="text-gray-400 whitespace-pre-wrap">
                    {log.content}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Terminal Input */}
        <form 
          onSubmit={handleExecute}
          className="p-4 bg-gray-900/30 border-t border-white/5 flex items-center gap-3"
        >
          <div className="text-blue-500">
            <Command className="w-4 h-4" />
          </div>
          <input 
            type="text"
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter kernel command..."
            className="flex-1 bg-transparent border-none text-white font-mono text-sm focus:outline-none placeholder:text-gray-800"
          />
          <div className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded border border-white/5">
            <Bot className="w-3 h-3 text-gray-600" />
            <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">Architect</span>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
