import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { springPresets } from '../lib/springs';
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  FileCode,
  Braces
} from 'lucide-react';

interface JsonNodeProps {
  name?: string;
  value: unknown;
  depth: number;
  searchTerm: string;
  defaultExpanded?: boolean;
}

const JsonNode: React.FC<JsonNodeProps> = ({ 
  name, 
  value, 
  depth, 
  searchTerm, 
  defaultExpanded = true 
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded && depth < 3);

  const isObject = value !== null && typeof value === 'object';
  const isArray = Array.isArray(value);

  // Check if this node or any child matches search term
  const matchesSearch = useMemo(() => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    if (name && name.toLowerCase().includes(term)) return true;
    if (!isObject && String(value).toLowerCase().includes(term)) return true;
    try {
      const str = JSON.stringify(value).toLowerCase();
      return str.includes(term);
    } catch {
      return false;
    }
  }, [name, value, searchTerm, isObject]);

  if (!matchesSearch) return null;

  if (isObject) {
    const entries = isArray 
      ? (value as unknown[]).map((v, i) => [String(i), v] as const)
      : Object.entries(value as Record<string, unknown>);
    
    const count = entries.length;
    const bracketOpen = isArray ? '[' : '{';
    const bracketClose = isArray ? ']' : '}';

    return (
      <div className="font-mono text-xs leading-relaxed my-0.5" style={{ paddingLeft: `${depth > 0 ? 16 : 0}px` }}>
        <div 
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 cursor-pointer py-0.5 px-1 rounded hover:bg-white/[0.06] select-none text-gray-300 transition-colors"
        >
          <span className="text-gray-500">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>

          {name !== undefined && (
            <span className="text-violet-300 font-medium">
              "{name}":
            </span>
          )}

          <span className="text-gray-400 font-semibold">{bracketOpen}</span>

          {!isExpanded && (
            <span className="text-gray-500 text-[11px] px-1 bg-white/5 rounded">
              {count} {count === 1 ? 'item' : 'items'}
            </span>
          )}

          {!isExpanded && <span className="text-gray-400 font-semibold">{bracketClose}</span>}
        </div>

        {isExpanded && (
          <div className="border-l border-white/10 ml-2 pl-2">
            {entries.map(([key, childVal]) => (
              <JsonNode 
                key={key} 
                name={isArray ? undefined : key} 
                value={childVal} 
                depth={depth + 1} 
                searchTerm={searchTerm} 
                defaultExpanded={defaultExpanded}
              />
            ))}
            <div className="text-gray-400 font-semibold py-0.5 select-none">{bracketClose}</div>
          </div>
        )}
      </div>
    );
  }

  // Primitive value rendering with syntax highlight colors
  let valueElement: React.ReactNode;
  if (typeof value === 'string') {
    const isHighlight = searchTerm && value.toLowerCase().includes(searchTerm.toLowerCase());
    valueElement = (
      <span className={`${isHighlight ? 'bg-amber-500/20 text-amber-200 px-0.5 rounded' : 'text-emerald-300'}`}>
        "{value}"
      </span>
    );
  } else if (typeof value === 'number') {
    valueElement = <span className="text-cyan-300 font-semibold">{value}</span>;
  } else if (typeof value === 'boolean') {
    valueElement = <span className="text-fuchsia-400 font-semibold">{String(value)}</span>;
  } else if (value === null) {
    valueElement = <span className="text-rose-400 italic">null</span>;
  } else if (value === undefined) {
    valueElement = <span className="text-gray-500 italic">undefined</span>;
  } else {
    valueElement = <span className="text-gray-300">{String(value)}</span>;
  }

  return (
    <div className="font-mono text-xs leading-relaxed my-0.5" style={{ paddingLeft: `${depth > 0 ? 16 : 0}px` }}>
      <div className="inline-flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-white/[0.04]">
        {name !== undefined && (
          <span className="text-violet-300">
            "{name}":
          </span>
        )}
        {valueElement}
      </div>
    </div>
  );
};

export interface JsonGraphInspectorProps {
  data: unknown;
  title?: string;
  maxHeight?: string;
  defaultExpanded?: boolean;
}

export const JsonGraphInspector: React.FC<JsonGraphInspectorProps> = ({
  data,
  title = 'JSON Inspector',
  maxHeight = '420px',
  defaultExpanded = true,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [expandAllKey, setExpandAllKey] = useState<number>(0);
  const [isAllExpanded, setIsAllExpanded] = useState<boolean>(defaultExpanded);

  const handleCopy = useCallback(() => {
    try {
      const jsonStr = JSON.stringify(data, null, 2);
      navigator.clipboard.writeText(jsonStr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [data]);

  const toggleExpandAll = () => {
    setIsAllExpanded(!isAllExpanded);
    setExpandAllKey(prev => prev + 1);
  };

  return (
    <div className="w-full rounded-2xl bg-slate-950/80 border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden flex flex-col">
      {/* Header Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <Braces size={14} />
          </div>
          <span className="text-xs font-semibold text-gray-200">{title}</span>
        </div>

        <div className="flex items-center gap-2 flex-1 max-w-xs sm:max-w-sm justify-end">
          {/* Search Box */}
          <div className="relative flex-1 max-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keys / values..."
              className="w-full pl-8 pr-2.5 py-1 text-xs bg-black/40 border border-white/10 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {/* Toggle Expand/Collapse */}
          <button
            onClick={toggleExpandAll}
            className="p-1.5 text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-violet-400"
            title={isAllExpanded ? 'Collapse All' : 'Expand All'}
            aria-label={isAllExpanded ? 'Collapse All' : 'Expand All'}
          >
            {isAllExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>

          {/* Copy JSON */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 active:bg-violet-600/30 border border-white/10 rounded-lg transition-colors focus:outline-none focus:ring-1 focus:ring-violet-400"
            aria-label="Copy JSON"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-400" />
                <span className="text-emerald-300">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* JSON Tree Viewer Scroll Container */}
      <div 
        className="p-4 overflow-y-auto overflow-x-auto text-left"
        style={{ maxHeight }}
      >
        <JsonNode 
          key={expandAllKey}
          value={data} 
          depth={0} 
          searchTerm={searchTerm}
          defaultExpanded={isAllExpanded}
        />
      </div>
    </div>
  );
};

export default JsonGraphInspector;
