import { useRef } from "react";
import { motion } from "framer-motion";

const EXAMPLES = [
  "I need an app for my small bakery so people can order",
  "make me something like Uber but for dogs",
  "We want a student portal where marks, attendance and notices are visible, with login for students and teachers. Must run on mobile, budget around 2 lakh, launch in 3 months.",
];

export default function Composer({ value, onChange, onSubmit, loading }) {
  const panel = useRef(null);
  const max = 4000;

  const onMove = (e) => {
    const r = panel.current.getBoundingClientRect();
    panel.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    panel.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const submit = () => {
    if (!loading && value.trim().length >= 3) onSubmit();
  };

  return (
    <motion.section
      ref={panel}
      onPointerMove={onMove}
      className="composer glow"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.0, duration: 0.7, ease: "easeOut" }}
    >
      <label htmlFor="idea" className="composer-label">Tell us what you need, in your own words</label>
      <textarea
        id="idea"
        value={value}
        maxLength={max}
        rows={5}
        placeholder="e.g. I want something like Instagram but for local artists…"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
        }}
        disabled={loading}
      />
      <div className="composer-foot">
        <div className="chips" role="group" aria-label="Example ideas">
          {EXAMPLES.map((ex, i) => (
            <button key={i} type="button" className="chip" onClick={() => onChange(ex)} disabled={loading}>
              {["Bakery app", "Uber for dogs", "Detailed example"][i]}
            </button>
          ))}
        </div>
        <div className="composer-actions">
          <span className="count">{value.length}/{max}</span>
          <button className="btn primary" onClick={submit} disabled={loading || value.trim().length < 3}>
            {loading ? "Working on it…" : "Build my proposal"}
          </button>
        </div>
      </div>
      <p className="hint">Tip: press Ctrl/Cmd + Enter to send.</p>
    </motion.section>
  );
}
