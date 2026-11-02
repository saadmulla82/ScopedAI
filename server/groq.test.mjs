// Quick offline self-test (mocks Groq). Run: npm test
import assert from "node:assert";
import { generateProposal, normalizeProposal, buildUserMessage } from "./groq.js";

const fake = {
  inputQuality: { score: 22, verdict: "Very short.", strengths: ["Mentions a shop"], gaps: ["No users"] },
  overview: { title: "Shop app", summary: "An app.", goals: ["Sell"], targetUsers: "Customers" },
  scope: { inScope: ["Catalogue"], outOfScope: ["Payments"] },
  deliverables: [{ name: "App", description: "Mobile app" }],
  milestones: [{ title: "Design", duration: "2 weeks", tasks: ["Wireframes"] }],
  risks: [{ risk: "Scope creep", impact: "Banana", mitigation: "Freeze scope" }],
  assumptions: ["Android first"],
  clarifyingQuestions: [{ question: "Who are the users?", why: "Shapes features" }],
};

const n = normalizeProposal(fake);
assert.equal(n.inputQuality.label, "Very vague");
assert.equal(n.provisional, true);
assert.equal(n.risks[0].impact, "Medium");
assert.equal(n.milestones[0].phase, "Phase 1");
assert.equal(n.clarifyingQuestions[0].id, "q1");
assert.equal(normalizeProposal({}).overview.title, "Untitled project");

assert.equal((await generateProposal({ prompt: "hi there" }, "")).status, 500);
assert.equal((await generateProposal({ prompt: "x" }, "k")).status, 400);
assert.match(buildUserMessage("p", [{ questions: ["q?"], answer: "a" }]), /CLARIFICATION ROUND 1/);

globalThis.fetch = async () => ({ ok: true, status: 200, json: async () => ({ choices: [{ message: { content: "```json\n" + JSON.stringify(fake) + "\n```" } }] }) });
const ok = await generateProposal({ prompt: "an app for my shop" }, "key");
assert.equal(ok.status, 200);
assert.equal(ok.data.proposal.overview.title, "Shop app");

globalThis.fetch = async () => ({ ok: false, status: 401 });
assert.equal((await generateProposal({ prompt: "an app for my shop" }, "bad")).status, 502);
console.log("All server tests passed.");
