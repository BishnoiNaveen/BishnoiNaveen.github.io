import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { springPresets } from '../../../lib/springs';

export default function SentinelAstDiffVisualizer() {
  const [viewMode, setViewMode] = useState<'diff' | 'ast'>('diff');

  return (
    <div className="w-full rounded-2xl md:rounded-3xl border border-[var(--color-border)] bg-[var(--material-1-bg)] p-5 sm:p-6 md:p-8 shadow-[var(--shadow-soft-md)] overflow-hidden">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#FF3B30] inline-block"></span>
          <span className="text-xs font-mono font-bold text-[var(--color-text-primary)]">
            Sentinel AI · AST Taint Sentry &amp; Patch Synthesizer
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode(viewMode === 'diff' ? 'ast' : 'diff')}
            className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-black/5 dark:bg-white/5 border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all cursor-pointer"
          >
            {viewMode === 'diff' ? 'View AST Tree' : 'View Code Diff'}
          </button>
          <span className="px-2.5 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-[11px] font-mono font-semibold">
            SAIF Tier 3
          </span>
        </div>
      </div>

      {viewMode === 'diff' ? (
        /* Dual-Column Code Diff */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vulnerable AST Sink */}
          <div className="p-4 rounded-xl border border-[#FF3B30]/30 bg-[#111114] text-[#E4E4E7] font-mono text-xs overflow-x-auto shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#FF453A] font-bold mb-2">
                <span>[TAINT SINK DETECTED]</span>
                <span>CWE-89 (SQL Injection)</span>
              </div>
              <pre className="text-zinc-400 text-[11px] leading-relaxed">
{`// Vulnerable Endpoint
app.get('/user', async (req, res) => {
  const { id } = req.query;
  
  // TAINT PATH: req.query -> sql query
  const sql = "SELECT * FROM users " +
              "WHERE id = '" + id + "'";
              
  const user = await db.query(sql);
  res.json(user);
});`}
              </pre>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-zinc-500">
              Sink: db.query(sql) · Taint Source: req.query.id
            </div>
          </div>

          {/* Synthesized Surgical AST Patch */}
          <div className="p-4 rounded-xl border border-[var(--color-success)]/30 bg-[#111114] text-[#E4E4E7] font-mono text-xs overflow-x-auto shadow-inner flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#30D158] font-bold mb-2">
                <span>[SURGICAL AST PATCH]</span>
                <span>Compiled &amp; Verified</span>
              </div>
              <pre className="text-zinc-400 text-[11px] leading-relaxed">
{`// Remediated via AST Parameterization
app.get('/user', async (req, res) => {
  const { id } = req.query;
  
  // SANITIZED: Parameterized Binding
  const sql = "SELECT * FROM users " +
              "WHERE id = $1";
              
  const user = await db.query(sql, [id]);
  res.json(user);
});`}
              </pre>
            </div>
            <div className="mt-3 pt-2 border-t border-zinc-800 text-[10px] text-emerald-400 font-semibold">
              AST Mutation: 1 Expression Replaced · 0 Syntax Errors
            </div>
          </div>
        </div>
      ) : (
        /* AST Tree Visualizer */
        <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[#111114] text-[#E4E4E7] font-mono text-xs overflow-x-auto">
          <div className="text-zinc-500 mb-2">// Abstract Syntax Tree Data-Flow Graph</div>
          <pre className="text-emerald-400 text-[11px] leading-relaxed">
{`Program
 └── ExpressionStatement (app.get)
      └── ArrowFunctionExpression (req, res)
           ├── VariableDeclaration (const { id } = req.query) [SOURCE: TAINTED]
           ├── VariableDeclaration (const sql = ... + id + ...) [PROPAGATED]
           └── AwaitExpression
                └── CallExpression (db.query) [SINK: SQL_EXECUTION] ⚠️ VULNERABLE`}
          </pre>
        </div>
      )}

      {/* Footer Metrics */}
      <div className="mt-4 pt-3 border-t border-[var(--color-border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <span className="text-[var(--color-text-secondary)]">
          AST Audit SLA: <strong className="text-[var(--color-text-primary)]">&lt; 120 ms / file</strong>
        </span>
        <span className="text-[var(--color-success)] font-semibold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]"></span>
          Zero False-Negative Invariant on Injection Sinks
        </span>
      </div>
    </div>
  );
}
