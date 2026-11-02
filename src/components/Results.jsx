import { useEffect, useState } from "react";
import { animate, motion } from "framer-motion";
import { toMarkdown } from "../lib/markdown.js";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } } };

function useCountUp(target) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const c = animate(0, target, { duration: 1.4, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [target]);
  return v;
}

function QualityCard({ q }) {
  const shown = useCountUp(q.score);
  const R = 54;
  const C = 2 * Math.PI * R;
  const tone = q.score < 40 ? "low" : q.score < 60 ? "mid" : q.score < 80 ? "good" : "great";
  return (
    <motion.section variants={item} className={`card quality tone-${tone}`}>
      <div className="ring" role="img" aria-label={`Input quality ${q.score} out of 100`}>
        <svg viewBox="0 0 130 130">
          <circle cx="65" cy="65" r={R} className="ring-track" />
          <motion.circle
            cx="65" cy="65" r={R} className="ring-bar"
            strokeDasharray={C}
            initial={{ strokeDashoffset: C }}
            animate={{ strokeDashoffset: C * (1 - q.score / 100) }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div className="ring-num"><b>{shown}</b><span>/100</span></div>
      </div>
      <div className="quality-body">
        <h2>Input quality: {q.label}</h2>
        <p>{q.verdict}</p>
        <div className="two">
          {q.strengths.length > 0 && (
            <div>
              <h3>What was clear</h3>
              <ul className="ticks">{q.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
          {q.gaps.length > 0 && (
            <div>
              <h3>What's missing</h3>
              <ul className="gaps">{q.gaps.map((s, i) => <li key={i}>{s}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}

function Card({ title, children, className = "" }) {
  return (
    <motion.section variants={item} className={`card ${className}`}>
      <h2>{title}</h2>
      {children}
    </motion.section>
  );
}

export default function Results({ p }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(p));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  const download = () => {
    const blob = new Blob([toMarkdown(p)], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${p.overview.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "proposal"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="results">
      {p.provisional && (
        <motion.div variants={item} className="banner">
          <b>This is a first draft.</b> Your idea is still a bit fuzzy, so some parts are educated guesses.
          Answer the questions at the bottom to sharpen it.
          <a href="#clarify" className="banner-link">Jump to questions ↓</a>
        </motion.div>
      )}

      <QualityCard q={p.inputQuality} />

      <Card title="Project overview">
        <h3 className="proj-title">{p.overview.title}</h3>
        <p className="lead">{p.overview.summary}</p>
        <div className="two">
          <div>
            <h3>Goals</h3>
            <ul className="dots">{p.overview.goals.map((g, i) => <li key={i}>{g}</li>)}</ul>
          </div>
          <div>
            <h3>Who it's for</h3>
            <p>{p.overview.targetUsers}</p>
          </div>
        </div>
      </Card>

      <Card title="Scope">
        <div className="two">
          <div className="scope in">
            <h3>In scope</h3>
            <ul className="ticks">{p.scope.inScope.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
          <div className="scope out">
            <h3>Out of scope</h3>
            <ul className="crosses">{p.scope.outOfScope.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        </div>
      </Card>

      <Card title="Deliverables">
        <div className="deliv">
          {p.deliverables.map((d, i) => (
            <div key={i} className="deliv-item">
              <b>{d.name}</b>
              <span>{d.description}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card title={`Milestones and timeline${p.totalDuration ? ` · ${p.totalDuration}` : ""}`}>
        <ol className="timeline">
          {p.milestones.map((m, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <span className="tl-dot" />
              <div className="tl-head">
                <span className="tl-phase">{m.phase}</span>
                <b>{m.title}</b>
                {m.duration && <span className="tl-time">{m.duration}</span>}
              </div>
              <ul className="dots">{m.tasks.map((t, j) => <li key={j}>{t}</li>)}</ul>
            </motion.li>
          ))}
        </ol>
      </Card>

      <Card title="Risks and how to handle them">
        <div className="risks">
          {p.risks.map((r, i) => (
            <div key={i} className="risk">
              <div className="risk-top">
                <b>{r.risk}</b>
                <span className={`pill ${r.impact.toLowerCase()}`}>{r.impact} impact</span>
              </div>
              <p>{r.mitigation}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card title="Assumptions">
        <ul className="dots">{p.assumptions.map((a, i) => <li key={i}>{a}</li>)}</ul>
      </Card>

      <motion.div variants={item} className="export">
        <button className="btn ghost" onClick={copy}>{copied ? "Copied!" : "Copy as Markdown"}</button>
        <button className="btn ghost" onClick={download}>Download .md file</button>
      </motion.div>
    </motion.div>
  );
}
