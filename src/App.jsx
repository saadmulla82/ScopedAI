import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Background from "./components/Background.jsx";
import Hero from "./components/Hero.jsx";
import Composer from "./components/Composer.jsx";
import Loading from "./components/Loading.jsx";
import Results from "./components/Results.jsx";
import Clarify from "./components/Clarify.jsx";
import { requestProposal } from "./lib/api.js";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [rounds, setRounds] = useState([]);
  const [proposal, setProposal] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [version, setVersion] = useState(0);
  const anchor = useRef(null);

  const run = async (nextRounds, isUpdate) => {
    setLoading(true);
    setError("");
    try {
      const p = await requestProposal(prompt.trim(), nextRounds);
      setProposal(p);
      setRounds(nextRounds);
      setVersion((v) => v + 1);
      if (isUpdate) setAnswer("");
      setTimeout(() => anchor.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 120);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const generate = () => run([], false);

  const update = () => {
    const entry = {
      questions: (proposal?.clarifyingQuestions || []).map((q) => q.question),
      answer: answer.trim(),
    };
    run([...rounds, entry], true);
  };

  const reset = () => {
    setProposal(null);
    setRounds([]);
    setAnswer("");
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Background />
      <main className="page">
        <Hero />
        <Composer value={prompt} onChange={setPrompt} onSubmit={generate} loading={loading && !proposal} />

        <div ref={anchor} className="anchor" />

        <AnimatePresence>
          {error && (
            <motion.div key="err" className="error" role="alert" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <b>Couldn't finish that.</b> {error}
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !proposal && <Loading />}

        {proposal && (
          <div className={loading ? "dim" : ""}>
            <div className="result-head">
              <h2 className="result-title">Your proposal{version > 1 ? ` · version ${version}` : ""}</h2>
              <button className="btn ghost small" onClick={reset} disabled={loading}>Start over</button>
            </div>
            <Results key={version} p={proposal} />
            <Clarify
              questions={proposal.clarifyingQuestions}
              answer={answer}
              onAnswer={setAnswer}
              onSubmit={update}
              loading={loading}
              round={rounds.length}
            />
          </div>
        )}

        {loading && proposal && <div className="toast" role="status">Updating your proposal…</div>}

        <footer className="foot">
          Built with React · Powered by Groq (gpt-oss-120b) · Proposals are AI drafts, so review them before sharing.
        </footer>
      </main>
    </>
  );
}
