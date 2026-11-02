import { motion } from "framer-motion";

const NOTES = [
  { t: "need an app for my shop… idk", cls: "n1" },
  { t: "like Uber but for dogs?", cls: "n2" },
  { t: "make it AI, asap!!", cls: "n3" },
  { t: "a website, something modern", cls: "n4" },
  { t: "can you build it cheap", cls: "n5" },
];

export default function Hero() {
  return (
    <header className="hero">
      {NOTES.map((n) => (
        <span key={n.t} className={`note ${n.cls}`} aria-hidden="true">{n.t}</span>
      ))}
      <motion.div
        className="brand"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true">
          <path d="M14 44 L26 24 L36 36 L50 16" fill="none" stroke="#F5F2EA" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="50" cy="16" r="6" fill="#C9A24B" />
        </svg>
        <span>Scoped</span>
      </motion.div>

      <h1 className="hero-title">
        {"Confused about what to do?".split(" ").map((word, i) => (
          <motion.span
            key={i}
            className="word"
            initial={{ opacity: 0, y: 40, rotate: 4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.15 + i * 0.09, type: "spring", stiffness: 120, damping: 16 }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
        <br />
        {"We're here for you!".split(" ").map((word, i) => (
          <motion.span
            key={i}
            className="word soft"
            initial={{ opacity: 0, y: 40, rotate: -4 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ delay: 0.65 + i * 0.09, type: "spring", stiffness: 120, damping: 16 }}
          >
            {word}&nbsp;
          </motion.span>
        ))}
      </h1>

      <motion.p
        className="hero-sub"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        Drop in your messy, half-formed idea. We'll turn it into a clear project proposal and ask you
        smart questions wherever the picture is still fuzzy.
      </motion.p>
    </header>
  );
}
