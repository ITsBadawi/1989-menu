import { motion } from "framer-motion";

export function Hero({ lang }: { lang: "ar" | "en" }) {
  return (
    <header className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.08 }}
        transition={{ duration: 1.6 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,theme(colors.teal)_0%,transparent_70%)]"
      />

      <motion.span
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="font-stamp text-xs tracking-[0.4em] text-gold-soft"
      >
        {lang === "ar" ? "سجل المائدة" : "EST. 1989"}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, scale: 1.12, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="mt-3 font-arDisplay text-6xl font-bold text-cream md:text-8xl"
      >
        ١٩٨٩
      </motion.h1>

      <motion.svg
        width="120"
        height="12"
        viewBox="0 0 120 12"
        className="mt-4"
      >
        <motion.path
          d="M0 6 H120"
          stroke="#C9A24B"
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
        />
      </motion.svg>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        className="mt-4 max-w-md font-arBody text-sm text-cream-muted"
      >
        {lang === "ar"
          ? "كل طبق قيد موثّق بذاكرة المطبخ منذ أول يوم"
          : "Every dish, a documented entry since day one"}
      </motion.p>
    </header>
  );
}
