import { useRef } from "react";
import { motion } from "framer-motion";

export default function Clarify({ questions, answer, onAnswer, onSubmit, loading, round }) {
  const box = useRef(null);
  const hasQuestions = questions.length > 0;

  const insert = (q) => {
    const prefix = answer && !answer.endsWith("\n") ? "\n\n" : "";
    onAnswer(`${answer}${prefix}${q}\nMy answer: `);
    requestAnimationFrame(() => {
      const el = box.current;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  };

  return (
    <motion.section
      id="clarify"
      className="card clarify glow-static"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
    >
      <h2>{hasQuestions ? "A few questions to sharpen this" : "Want to refine it further?"}</h2>
      <p className="lead">
        {hasQuestions
          ? "Tap a question to drop it into the box, then type your answer. Answer as many as you can."
          : "Your brief is in good shape. Add anything else (budget, deadline, must-have features) and we'll update the proposal."}
      </p>

      {hasQuestions && (
        <ul className="qlist">
          {questions.map((q) => (
            <li key={q.id}>
              <button type="button" onClick={() => insert(q.question)} disabled={loading}>
                <span className="q-text">{q.question}</span>
                {q.why && <span className="q-why">{q.why}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}

      <label htmlFor="answer" className="sr-only">Your answers</label>
      <textarea
        id="answer"
        ref={box}
        rows={6}
        value={answer}
        disabled={loading}
        maxLength={3000}
        placeholder="Type your answers here. Short is fine, e.g. “Students and teachers, mobile first, budget about 2 lakh.”"
        onChange={(e) => onAnswer(e.target.value)}
      />
      <div className="clarify-foot">
        <span className="count">{round > 0 ? `Round ${round + 1}` : "First refinement"}</span>
        <button className="btn primary" onClick={onSubmit} disabled={loading || answer.trim().length < 2}>
          {loading ? "Updating…" : "Update my proposal"}
        </button>
      </div>
    </motion.section>
  );
}
