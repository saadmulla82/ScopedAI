export function toMarkdown(p) {
  const list = (a) => a.map((x) => `- ${x}`).join("\n");
  return `# ${p.overview.title}

## Project overview
${p.overview.summary}

**Target users:** ${p.overview.targetUsers}

**Goals**
${list(p.overview.goals)}

## Scope
**In scope**
${list(p.scope.inScope)}

**Out of scope**
${list(p.scope.outOfScope)}

## Deliverables
${p.deliverables.map((d) => `- **${d.name}**: ${d.description}`).join("\n")}

## Milestones and timeline${p.totalDuration ? ` (${p.totalDuration})` : ""}
${p.milestones.map((m) => `### ${m.phase}: ${m.title} (${m.duration})\n${list(m.tasks)}`).join("\n\n")}

## Risks and mitigation
${p.risks.map((r) => `- **${r.risk}** [${r.impact}]: ${r.mitigation}`).join("\n")}

## Assumptions
${list(p.assumptions)}
`;
}
