/**
 * src/data/lab.ts — Systems Lab Experimental Suites Dataset
 * Author: Naveen Bishnoi
 * Standard: Deterministic Interactive State Machines, Verifiable Invariants, Zero Random Loops
 */

export interface DagNode {
  id: string;
  label: string;
  tier: number;
  domain: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  dependencies: string[];
  executionCostMs: number;
  invariant: string;
}

export interface DagEdge {
  from: string;
  to: string;
}

export interface TaintScenario {
  id: string;
  title: string;
  vulnerabilityType: string;
  cwe: string;
  source: string;
  sanitizer: string;
  sink: string;
  rawCodeSnippet: string;
  astNodes: {
    id: string;
    type: string;
    code: string;
    isTainted: boolean;
    isSanitizer: boolean;
    isSink: boolean;
  }[];
  surgicalPatchDiff: {
    removedLines: string[];
    addedLines: string[];
    explanation: string;
  };
}

export interface InodeStep {
  stepNumber: number;
  posixSyscall: string;
  operation: string;
  targetInode: string;
  liveFileInode: string;
  diskState: string;
  journalState: string;
  crashOutcomeIfInterrupted: string;
  invariantGuaranteed: string;
}

export interface LabSuiteData {
  dagInspector: {
    initialNodes: DagNode[];
    initialEdges: DagEdge[];
    cyclicEdgeSample: DagEdge;
  };
  astTaintVisualizer: {
    scenarios: TaintScenario[];
  };
  inodeSimulator: {
    steps: InodeStep[];
    initialState: {
      liveInode: string;
      tempInode: string;
      liveFileContent: string;
      newPayload: string;
    };
  };
}

export const labSuiteData: LabSuiteData = {
  dagInspector: {
    initialNodes: [
      {
        id: 'ingest',
        label: 'Ingest Source Delta',
        tier: 1,
        domain: 'GitOps Input',
        status: 'completed',
        dependencies: [],
        executionCostMs: 12,
        invariant: 'Immutable Git SHA ref'
      },
      {
        id: 'ast_parse',
        label: 'AST Lexer & Parser',
        tier: 2,
        domain: 'Static Analysis',
        status: 'completed',
        dependencies: ['ingest'],
        executionCostMs: 24,
        invariant: 'Valid Syntax Tree / Zero Panic'
      },
      {
        id: 'taint_sentry',
        label: 'AST Taint Sentry',
        tier: 3,
        domain: 'Security Engine',
        status: 'active',
        dependencies: ['ast_parse'],
        executionCostMs: 45,
        invariant: 'Source-to-Sink Taint Traversal = Clean'
      },
      {
        id: 'bft_quorum',
        label: 'BFT Multi-Agent Quorum',
        tier: 3,
        domain: 'Consensus Protocol',
        status: 'pending',
        dependencies: ['ast_parse'],
        executionCostMs: 80,
        invariant: '3f+1 Signatures Collected'
      },
      {
        id: 'patch_synth',
        label: 'Patch Diff Synthesizer',
        tier: 4,
        domain: 'Code Generation',
        status: 'pending',
        dependencies: ['taint_sentry', 'bft_quorum'],
        executionCostMs: 35,
        invariant: 'Minimal Surgical Diff Bounds'
      },
      {
        id: 'canary_deploy',
        label: 'Istio Canary Deployment',
        tier: 5,
        domain: 'Edge Infrastructure',
        status: 'pending',
        dependencies: ['patch_synth'],
        executionCostMs: 120,
        invariant: 'Zero Error Budget Breached'
      }
    ],
    initialEdges: [
      { from: 'ingest', to: 'ast_parse' },
      { from: 'ast_parse', to: 'taint_sentry' },
      { from: 'ast_parse', to: 'bft_quorum' },
      { from: 'taint_sentry', to: 'patch_synth' },
      { from: 'bft_quorum', to: 'patch_synth' },
      { from: 'patch_synth', to: 'canary_deploy' }
    ],
    cyclicEdgeSample: { from: 'canary_deploy', to: 'ast_parse' }
  },

  astTaintVisualizer: {
    scenarios: [
      {
        id: 'cmd-injection',
        title: 'Command Injection via Unsanitized Child Process',
        vulnerabilityType: 'Remote Code Execution (RCE)',
        cwe: 'CWE-78',
        source: 'req.query.target',
        sanitizer: 'validateIdentifier(target)',
        sink: 'exec(cmd)',
        rawCodeSnippet: `// Vulnerable Target Code
app.get('/api/diagnostic', (req, res) => {
  const target = req.query.target; // SOURCE
  const cmd = "ping -c 4 " + target;
  exec(cmd, (err, stdout) => { // SINK: Unescaped shell execution
    res.send(stdout);
  });
});`,
        astNodes: [
          { id: 'n1', type: 'MemberExpression (Source)', code: 'req.query.target', isTainted: true, isSanitizer: false, isSink: false },
          { id: 'n2', type: 'VariableDeclarator', code: 'const target = ...', isTainted: true, isSanitizer: false, isSink: false },
          { id: 'n3', type: 'BinaryExpression (+)', code: '"ping -c 4 " + target', isTainted: true, isSanitizer: false, isSink: false },
          { id: 'n4', type: 'CallExpression (Sanitizer)', code: 'validateIdentifier(target)', isTainted: false, isSanitizer: true, isSink: false },
          { id: 'n5', type: 'CallExpression (Sink)', code: 'exec(cmd)', isTainted: true, isSanitizer: false, isSink: true }
        ],
        surgicalPatchDiff: {
          removedLines: [
            '- const cmd = "ping -c 4 " + target;',
            '- exec(cmd, (err, stdout) => { ... });'
          ],
          addedLines: [
            '+ if (!/^[a-zA-Z0-9.-]+$/.test(target)) throw new Error("Invalid Host");',
            '+ execFile("/bin/ping", ["-c", "4", target], (err, stdout) => { ... });'
          ],
          explanation: 'Replaces string interpolation shell execution with parameterized execFile() and strict alphanumeric regex assertion.'
        }
      },
      {
        id: 'path-traversal',
        title: 'Arbitrary File Overwrite via Path Traversal',
        vulnerabilityType: 'Path Traversal / Arbitrary Write',
        cwe: 'CWE-22',
        source: 'req.body.filename',
        sanitizer: 'path.basename(filename)',
        sink: 'fs.writeFileSync(destination, data)',
        rawCodeSnippet: `// Vulnerable File Upload Handler
app.post('/api/upload', (req, res) => {
  const { filename, data } = req.body; // SOURCE: "../../../etc/passwd"
  const destination = path.join("/var/storage", filename);
  fs.writeFileSync(destination, data); // SINK: Directory escape overwrite
  res.json({ ok: true });
});`,
        astNodes: [
          { id: 'n1', type: 'PropertyAccess (Source)', code: 'req.body.filename', isTainted: true, isSanitizer: false, isSink: false },
          { id: 'n2', type: 'CallExpression', code: 'path.join("/var/storage", filename)', isTainted: true, isSanitizer: false, isSink: false },
          { id: 'n3', type: 'CallExpression (Sanitizer)', code: 'path.basename(filename)', isTainted: false, isSanitizer: true, isSink: false },
          { id: 'n4', type: 'CallExpression (Sink)', code: 'fs.writeFileSync(destination, data)', isTainted: true, isSanitizer: false, isSink: true }
        ],
        surgicalPatchDiff: {
          removedLines: [
            '- const destination = path.join("/var/storage", filename);'
          ],
          addedLines: [
            '+ const safeName = path.basename(filename);',
            '+ const destination = path.resolve("/var/storage", safeName);',
            '+ if (!destination.startsWith("/var/storage/")) throw new Error("Path Escape Detected");'
          ],
          explanation: 'Strips directory traversal sequences using path.basename() and asserts root prefix boundary.'
        }
      }
    ]
  },

  inodeSimulator: {
    initialState: {
      liveInode: '#30811',
      tempInode: '#41092',
      liveFileContent: 'RECORD_V1: { id: 101, balance: 450.00, status: "ACTIVE" }',
      newPayload: 'RECORD_V2: { id: 101, balance: 900.00, status: "COMMITTED" }'
    },
    steps: [
      {
        stepNumber: 1,
        posixSyscall: 'open("data.db.tmp", O_WRONLY | O_CREAT | O_TRUNC, 0644)',
        operation: 'Create Temporary File & Allocate Inode',
        targetInode: '#41092 (Temp Inode)',
        liveFileInode: '#30811 (Live Inode)',
        diskState: 'Live file untouched. Temp inode created in superblock allocation bitmap.',
        journalState: 'Log entry: CREATE tmp_file (Inode #41092)',
        crashOutcomeIfInterrupted: 'CRASH SAFE: Live inode #30811 is untouched. Temp inode is unlinked during fsck recovery.',
        invariantGuaranteed: 'Live Data Remains 100% Intact'
      },
      {
        stepNumber: 2,
        posixSyscall: 'write(fd_tmp, new_payload, sizeof(new_payload))',
        operation: 'Write Payload to Dirty OS Page Cache',
        targetInode: '#41092 (Dirty Buffers)',
        liveFileInode: '#30811 (Clean Read-Only)',
        diskState: 'Payload held in kernel page cache. Physical disk sectors not yet persisted.',
        journalState: 'Buffered write transaction pending.',
        crashOutcomeIfInterrupted: 'CRASH SAFE: Kernel pages discarded on crash. Live file continues serving RECORD_V1 without corruption.',
        invariantGuaranteed: 'Zero Partial Write to Live Inode'
      },
      {
        stepNumber: 3,
        posixSyscall: 'fsync(fd_tmp)',
        operation: 'Flush Dirty Pages & Force Hardware Platter Sync',
        targetInode: '#41092 (Persisted on Disk)',
        liveFileInode: '#30811 (Persisted on Disk)',
        diskState: 'All bytes of RECORD_V2 physically written to magnetic/NAND flash sectors for Inode #41092.',
        journalState: 'Commit log: Inode #41092 payload flushed to disk.',
        crashOutcomeIfInterrupted: 'CRASH SAFE: Both inodes exist independently on disk. Directory still points "data.db" to #30811.',
        invariantGuaranteed: 'Physical Data Durability Before Directory Update'
      },
      {
        stepNumber: 4,
        posixSyscall: 'rename("data.db.tmp", "data.db")',
        operation: 'POSIX Atomic Inode Pointer Replacement',
        targetInode: '#41092 (Swapped to "data.db")',
        liveFileInode: '#30811 (Unlinked / Refcount=0)',
        diskState: 'Single atomic VFS directory entry update. "data.db" instantaneously points to Inode #41092.',
        journalState: 'Atomic commit: DIR_ENTRY "data.db" -> #41092. Free #30811.',
        crashOutcomeIfInterrupted: 'CRASH PROOF: Atomic rename is indivisible. Either old or new file is read; never a half-state.',
        invariantGuaranteed: 'Atomic Inode Swap (No Intermediary State)'
      },
      {
        stepNumber: 5,
        posixSyscall: 'fsync(dir_fd)',
        operation: 'Flush Parent Directory Inode to Disk',
        targetInode: '#41092 (Committed to Directory Entry)',
        liveFileInode: 'Freed',
        diskState: 'Directory block containing updated "data.db" pointer is persisted to disk.',
        journalState: 'Journal cleared. Transaction complete.',
        crashOutcomeIfInterrupted: 'COMMITTED: Directory change is durable across power loss.',
        invariantGuaranteed: 'Metadata Durability Guaranteed'
      },
      {
        stepNumber: 6,
        posixSyscall: 'close(fd_tmp)',
        operation: 'Release File Descriptor & Clean Exit',
        targetInode: '#41092 (Active "data.db")',
        liveFileInode: 'Freed',
        diskState: 'Transaction finalized. Zero memory leaks, zero dangling file descriptors.',
        journalState: 'Clean state.',
        crashOutcomeIfInterrupted: 'COMMITTED: Fully operational.',
        invariantGuaranteed: '0-Byte Leak & Clean Descriptor Closure'
      }
    ]
  }
};
