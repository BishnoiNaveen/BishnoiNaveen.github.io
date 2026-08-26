/**
 * m4-editorial-skills-lab-contact.test.mjs — Milestone 4 E2E Verification Suite
 * Validates:
 * 1. Long-form Editorial About & 3-Tier Career Timeline (bio.ts, EditorialAbout.astro)
 * 2. 4-Domain Competency Bento Grid & Codebase Evidence Tags (skills.ts, SkillsBento.tsx)
 * 3. The Systems Lab: 3 Interactive Experimental Sandbox Tools (lab.ts, LabSuite.tsx)
 * 4. Direct Contact Chapter, SLA Guarantee & System Footer (ContactTerminal.tsx, Footer.astro)
 * 5. Complete 8-Chapter Storytelling Integration across dist/index.html & dedicated routes
 */

import fs from 'node:fs';
import path from 'node:path';
import { createTestSuite, WORKSPACE_ROOT, importModule } from '../utils/test-helpers.mjs';

const suite = createTestSuite(
  'Milestone 4: Editorial Narrative, Skills Bento, Systems Lab & Contact Chapter',
  3,
  'Empirical verification of 3-tier timeline, 4-domain skills bento, 3 interactive lab sandboxes, direct contact bridge, and 8-chapter narrative flow.'
);

// ----------------------------------------------------------------------------
// 1. Editorial Narrative & 3-Tier Timeline
// ----------------------------------------------------------------------------
suite.test('1.1: Bio dataset structure and 3-Tier Career Delineation Invariants', async (ctx) => {
  const bioPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'bio.ts');
  ctx.assertFileExists(bioPath, 'src/data/bio.ts must exist');

  const { bioData } = await importModule(bioPath);
  ctx.assertEqual(bioData.name, 'Naveen Bishnoi', 'Bio name must be Naveen Bishnoi');
  ctx.assertNonEmptyString(bioData.leadQuote, 'Bio must include an authoritative lead quote');
  ctx.assert(bioData.narrativeSections.length >= 4, 'Bio must have at least 4 long-form narrative essay sections');

  // Verify 3 distinct timeline tiers
  const tiers = bioData.timeline;
  ctx.assertEqual(tiers.length, 3, 'Timeline must contain exactly 3 tiers');

  const tier1 = tiers.find(t => t.tier === 1);
  ctx.assert(tier1 !== undefined, 'Tier 1 must exist');
  ctx.assertEqual(tier1.tierLabel, 'Corporate Engineering', 'Tier 1 must be Corporate Engineering');
  ctx.assertEqual(tier1.organization, 'KRONE Agriculture India', 'Tier 1 organization must be KRONE Agriculture India');
  ctx.assert(tier1.keyInvariants.some(i => i.includes('50Hz') || i.includes('CAN Bus')), 'Tier 1 must cite 50Hz CAN bus invariants');

  const tier2 = tiers.find(t => t.tier === 2);
  ctx.assert(tier2 !== undefined, 'Tier 2 must exist');
  ctx.assertEqual(tier2.tierLabel, 'Academic Foundation', 'Tier 2 must be Academic Foundation');
  ctx.assert(tier2.title.includes('BCA') || tier2.title.includes('Bachelor'), 'Tier 2 must be BCA Graduate');

  const tier3 = tiers.find(t => t.tier === 3);
  ctx.assert(tier3 !== undefined, 'Tier 3 must exist');
  ctx.assertEqual(tier3.tierLabel, 'Open-Source Systems Leadership', 'Tier 3 must be Open-Source Systems Leadership');
  ctx.assert(tier3.technologies.length >= 4, 'Tier 3 must specify rich systems technologies');
});

suite.test('1.2: Core System Axioms & Mathematical Philosophy Invariants', async (ctx) => {
  const bioPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'bio.ts');
  const { bioData } = await importModule(bioPath);

  ctx.assertEqual(bioData.principles.length, 3, 'Must define exactly 3 core philosophy principles');
  const titles = bioData.principles.map(p => p.title);
  ctx.assert(titles.includes('Invariants Over Assertions'), 'Must define Invariants Over Assertions');
  ctx.assert(titles.includes('Zero Dynamic Leaks'), 'Must define Zero Dynamic Leaks');
  ctx.assert(titles.includes('Deterministic Automation'), 'Must define Deterministic Automation');

  for (const pr of bioData.principles) {
    ctx.assertNonEmptyString(pr.invariant, `Principle "${pr.title}" must specify mathematical invariant`);
  }
});

// ----------------------------------------------------------------------------
// 2. Competency Bento Grid & Evidence Tags
// ----------------------------------------------------------------------------
suite.test('2.1: 4 Architectural Domains & Verifiable Codebase Evidence Tags', async (ctx) => {
  const skillsPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'skills.ts');
  ctx.assertFileExists(skillsPath, 'src/data/skills.ts must exist');

  const { skillDomains, allSkillsList } = await importModule(skillsPath);
  ctx.assertEqual(skillDomains.length, 4, 'Must define exactly 4 architectural domains');
  ctx.assert(allSkillsList.length >= 10, 'Must define at least 10 comprehensive competencies');

  // Verify each domain ID
  const domainIds = skillDomains.map(d => d.id);
  ctx.assert(domainIds.includes('systems'), 'Must include systems domain');
  ctx.assert(domainIds.includes('ai'), 'Must include AI domain');
  ctx.assert(domainIds.includes('frontend'), 'Must include frontend craft domain');
  ctx.assert(domainIds.includes('infrastructure'), 'Must include infrastructure domain');

  // Verify all skills have valid evidence tags linking to repositories
  for (const skill of allSkillsList) {
    ctx.assertNonEmptyString(skill.evidenceRepo, `Skill "${skill.name}" must cite evidence repository`);
    ctx.assertNonEmptyString(skill.evidenceProof, `Skill "${skill.name}" must cite verifiable evidence proof`);
    ctx.assert(skill.verifiedInvariants.length > 0, `Skill "${skill.name}" must specify verified invariants`);
  }
});

suite.test('2.2: Strict Prohibition of Percentage Bars Across Skills Components', (ctx) => {
  const bentoPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'about', 'SkillsBento.tsx');
  const matrixPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'about', 'SkillsMatrix.astro');
  const sectionPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'about', 'SkillsSection.astro');

  const filesToCheck = [bentoPath, matrixPath, sectionPath];
  for (const f of filesToCheck) {
    ctx.assertFileExists(f, `${path.basename(f)} must exist`);
    const content = fs.readFileSync(f, 'utf8');
    ctx.assertDoesNotMatch(
      content,
      /\b\d{1,3}%\b|progress-bar|proficiency-bar|skill-level-fill/i,
      `Component ${path.basename(f)} must NOT contain arbitrary percentage progress bars`
    );
  }
});

// ----------------------------------------------------------------------------
// 3. The Systems Lab Suite & Interactive State Machines
// ----------------------------------------------------------------------------
suite.test('3.1: Tool 1 DAG Inspector: Kahn Cycle Detection & Topological Traversal Invariants', async (ctx) => {
  const labPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'lab.ts');
  ctx.assertFileExists(labPath, 'src/data/lab.ts must exist');

  const { labSuiteData } = await importModule(labPath);
  const { initialNodes, initialEdges, cyclicEdgeSample } = labSuiteData.dagInspector;

  ctx.assert(initialNodes.length >= 5, 'DAG must have at least 5 nodes');
  ctx.assert(initialEdges.length >= 5, 'DAG must have at least 5 dependency edges');

  // Test Kahn Topological Sort on acyclic graph
  const runKahn = (nodes, edges) => {
    const adj = new Map(nodes.map(n => [n.id, []]));
    const inDegree = new Map(nodes.map(n => [n.id, 0]));
    for (const { from, to } of edges) {
      adj.get(from).push(to);
      inDegree.set(to, (inDegree.get(to) || 0) + 1);
    }
    const queue = nodes.filter(n => inDegree.get(n.id) === 0).map(n => n.id);
    const order = [];
    while (queue.length > 0) {
      const u = queue.shift();
      order.push(u);
      for (const v of adj.get(u) || []) {
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) queue.push(v);
      }
    }
    return { hasCycle: order.length !== nodes.length, order };
  };

  const acyclicResult = runKahn(initialNodes, initialEdges);
  ctx.assertEqual(acyclicResult.hasCycle, false, 'Standard task graph must be acyclic');
  ctx.assertEqual(acyclicResult.order.length, initialNodes.length, 'Topological sort must order all nodes');

  // Test Kahn with cyclic edge injected
  const cyclicEdges = [...initialEdges, cyclicEdgeSample];
  const cyclicResult = runKahn(initialNodes, cyclicEdges);
  ctx.assertEqual(cyclicResult.hasCycle, true, 'Cyclic edge must be immediately detected by Kahn algorithm');
});

suite.test('3.2: Tool 2 AST Taint Visualizer: Source-to-Sink Flow & Surgical Diff Patch', async (ctx) => {
  const labPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'lab.ts');
  const { labSuiteData } = await importModule(labPath);

  const scenarios = labSuiteData.astTaintVisualizer.scenarios;
  ctx.assert(scenarios.length >= 2, 'AST visualizer must contain at least 2 security taint scenarios');

  for (const sc of scenarios) {
    ctx.assertNonEmptyString(sc.cwe, `Scenario "${sc.title}" must specify CWE classification`);
    ctx.assertNonEmptyString(sc.source, `Scenario "${sc.title}" must specify taint source`);
    ctx.assertNonEmptyString(sc.sink, `Scenario "${sc.title}" must specify taint sink`);
    ctx.assert(sc.astNodes.length >= 4, `Scenario "${sc.title}" must define AST node flow`);
    ctx.assert(sc.surgicalPatchDiff.addedLines.length > 0, `Scenario "${sc.title}" must include surgical patch`);
    ctx.assert(sc.surgicalPatchDiff.removedLines.length > 0, `Scenario "${sc.title}" must include removed vulnerable lines`);
  }
});

suite.test('3.3: Tool 3 POSIX Inode Storage: Atomic rename() State Machine & Crash Recovery', async (ctx) => {
  const labPath = path.join(WORKSPACE_ROOT, 'src', 'data', 'lab.ts');
  const { labSuiteData } = await importModule(labPath);

  const steps = labSuiteData.inodeSimulator.steps;
  ctx.assertEqual(steps.length, 6, 'POSIX inode commit must define exact 6-step lifecycle');

  // Verify rename() atomic swap step
  const renameStep = steps.find(s => s.posixSyscall.includes('rename('));
  ctx.assert(renameStep !== undefined, 'Must include POSIX rename() step');
  ctx.assertEqual(renameStep.stepNumber, 4, 'rename() must be step 4');
  ctx.assert(renameStep.crashOutcomeIfInterrupted.includes('CRASH PROOF') || renameStep.crashOutcomeIfInterrupted.includes('indivisible'), 'rename() step must guarantee crash proof atomicity');

  // Verify all steps guarantee non-corrupted recovery
  for (const st of steps) {
    ctx.assertNonEmptyString(st.crashOutcomeIfInterrupted, `Step ${st.stepNumber} must define crash recovery outcome`);
    ctx.assertNonEmptyString(st.invariantGuaranteed, `Step ${st.stepNumber} must define mathematical invariant`);
  }
});

// ----------------------------------------------------------------------------
// 4. Contact Chapter, SLA Guarantee & Footer
// ----------------------------------------------------------------------------
suite.test('4.1: Direct Contact Terminal with Verified Email & 24h SLA', async (ctx) => {
  const contactCompPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'contact', 'ContactTerminal.tsx');
  ctx.assertFileExists(contactCompPath, 'ContactTerminal.tsx must exist');

  const content = fs.readFileSync(contactCompPath, 'utf8');
  ctx.assert(content.includes('0029bishnoinaveen@gmail.com'), 'Must provide authoritative email 0029bishnoinaveen@gmail.com');
  ctx.assert(content.includes('24 Hours') || content.includes('24 hours'), 'Must guarantee Response SLA < 24 Hours');
  ctx.assert(content.includes('Asia/Kolkata') || content.includes('IST'), 'Must configure IST timezone clock');
  ctx.assert(content.includes('/Naveen_Bishnoi_Resume.pdf'), 'Must link to verified resume download PDF');
});

suite.test('4.2: Semantic Footer Architecture Disclosure & Social Links', (ctx) => {
  const footerPath = path.join(WORKSPACE_ROOT, 'src', 'components', 'contact', 'Footer.astro');
  ctx.assertFileExists(footerPath, 'Footer.astro must exist');

  const content = fs.readFileSync(footerPath, 'utf8');
  ctx.assert(content.includes('role="contentinfo"') || content.includes('<footer'), 'Footer must have semantic landmark');
  ctx.assert(content.includes('Naveen Bishnoi'), 'Footer must feature author copyright');
  ctx.assert(content.includes('github.com/BishnoiNaveen'), 'Footer must link to GitHub');
  ctx.assert(content.includes('linkedin.com/in/naveen-bishnoi'), 'Footer must link to LinkedIn');
});

// ----------------------------------------------------------------------------
// 5. 8-Chapter Narrative Storytelling & Route Build Integrity
// ----------------------------------------------------------------------------
suite.test('5.1: 8-Chapter Master Narrative Flow in Built HTML (dist/index.html)', (ctx) => {
  const indexPath = path.join(WORKSPACE_ROOT, 'dist', 'index.html');
  ctx.assertFileExists(indexPath, 'dist/index.html must exist');

  const html = fs.readFileSync(indexPath, 'utf8');

  // Verify all 8 chapter anchors exist
  const expectedAnchors = [
    'hero',
    'manifesto',
    'work',
    'projects',
    'lab',
    'workflows',
    'hermes',
    'about',
    'skills',
    'timeline',
    'contact'
  ];

  for (const anchor of expectedAnchors) {
    const hasAnchor = html.includes(`id="${anchor}"`) || html.includes(`id='${anchor}'`);
    ctx.assert(hasAnchor, `dist/index.html must contain chapter anchor #${anchor}`);
  }

  // Verify semantic landmarks
  ctx.assert(html.includes('<header') || html.includes('role="banner"'), 'dist/index.html must have <header>');
  ctx.assert(html.includes('<main') || html.includes('role="main"'), 'dist/index.html must have <main>');
  ctx.assert(html.includes('<footer') || html.includes('role="contentinfo"'), 'dist/index.html must have <footer>');
  ctx.assert(html.includes('<nav') || html.includes('role="navigation"'), 'dist/index.html must have <nav>');
});

suite.test('5.2: Dedicated Route Pages Integrity (/lab, /contact, /resume, /projects)', (ctx) => {
  const routes = ['lab', 'contact', 'resume', 'projects'];
  for (const route of routes) {
    const routeHtmlPath = path.join(WORKSPACE_ROOT, 'dist', route, 'index.html');
    ctx.assertFileExists(routeHtmlPath, `dist/${route}/index.html must be generated during build`);
    const html = fs.readFileSync(routeHtmlPath, 'utf8');
    ctx.assert(html.includes('Naveen Bishnoi'), `Route /${route} must contain branding for Naveen Bishnoi`);
    ctx.assert(html.length > 500, `Route /${route} must have non-trivial content`);
  }
});

// Run directly if invoked via CLI
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(import.meta.filename)) {
  const result = await suite.run();
  process.exit(result.passed ? 0 : 1);
}

export default suite;
