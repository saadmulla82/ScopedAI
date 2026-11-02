import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const STEPS = [
  "Reading between the lines…",
  "Rating how clear your brief is…",
  "Drawing the scope boundaries…",
  "Planning milestones…",
  "Spotting risks early…",
  "Polishing the final proposal…",
];

export default function Loading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % STEPS.length), 1600);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div className="loading glow-static" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} role="status" aria-live="polite">
      <div className="loader" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((n) => (
          <span key={n} style={{ animationDelay: `${n * 0.12}s` }} />
        ))}
      </div>
      <p>{STEPS[i]}</p>
      <div className="skeletons" aria-hidden="true">
        <div className="sk w60" /><div className="sk w90" /><div className="sk w75" />
      </div>
    </motion.div>
  );
}
