import { motion } from "framer-motion";
import type { Restaurant } from "../../types";

export function Hero({ restaurant, lang }: { restaurant?: Restaurant; lang: "ar" | "en" }) {
  const particles = Array.from({ length: 14 });

  return (
    <section className="relative overflow-hidden pt-16 pb-14 sm:pt-24 sm:pb-20">
      <div className="absolute inset-0 bg-tea-gradient" />
      <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_1px_1px,#c9a227_1px,transparent_0)] bg-[size:26px_26px]" />

      {particles.map((_, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold/40"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
          }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: 5 + (i % 4),
            repeat: Infinity,
            delay: i * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-3 font-arBody text-xs tracking-[0.3em] text-gold-soft uppercase"
        >
          {lang === "ar" ? "بغداد × برلين" : "Baghdad × Berlin"}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-7xl sm:text-8xl font-semibold tracking-tight text-cream"
        >
          {restaurant?.name || "1989"}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mx-auto mt-5 h-px w-32 bg-gold-line"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mx-auto mt-5 max-w-md font-arBody text-cream-muted text-balance"
        >
          {lang === "ar"
            ? restaurant?.about ||
              "فطور عراقي أصيل وسناك عصري، حيث يلتقي طعم بغداد بروح برلين"
            : restaurant?.aboutEn ||
              "Authentic Iraqi breakfast and modern snacks, where Baghdad meets Berlin"}
        </motion.p>
      </div>
    </section>
  );
}
