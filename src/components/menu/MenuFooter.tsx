import { MapPin, Clock, Phone } from "lucide-react";
import type { Restaurant } from "../../types";

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.02 3.37-2.49V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
  </svg>
);

const InstagramIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.9.25-1.5 1.55-1.5H16.5V4.3c-.28-.04-1.23-.13-2.34-.13-2.32 0-3.91 1.42-3.91 4V10.5H8v3h2.25V21h3.25z" />
  </svg>
);

export function MenuFooter({
  restaurant,
  lang,
}: {
  restaurant?: Restaurant;
  lang: "ar" | "en";
}) {
  if (!restaurant) return null;

  return (
    <footer className="border-t border-base-line bg-base-soft mt-16">
      <div className="mx-auto max-w-3xl px-5 py-12">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <h4 className="font-display text-2xl font-semibold text-gold mb-3">
              {restaurant.name}
            </h4>
            <p className="font-arBody text-sm text-cream-muted mb-4 leading-relaxed">
              {lang === "ar" ? restaurant.about : restaurant.aboutEn}
            </p>
            <div className="flex items-center gap-3">
              {restaurant.socials.map((s) => (
                <a
                  key={s.platform}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-base-line text-cream-muted hover:border-gold hover:text-gold transition-colors"
                >
                  {s.platform === "instagram" && <InstagramIcon />}
                  {s.platform === "facebook" && <FacebookIcon />}
                  {s.platform === "tiktok" && <TikTokIcon />}
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-3 font-arBody text-sm">
            <div className="flex items-start gap-2.5 text-cream-muted">
              <MapPin size={16} className="mt-0.5 shrink-0 text-gold-soft" />
              <span>{restaurant.address}</span>
            </div>
            {restaurant.phones.map((p, i) => (
              <div key={i} className="flex items-center gap-2.5 text-cream-muted">
                <Phone size={16} className="shrink-0 text-gold-soft" />
                <a href={`tel:${p.number}`} dir="ltr" className="hover:text-gold transition-colors">
                  {p.number}
                </a>
                {p.isWhatsapp && (
                  <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] text-green-400">
                    WhatsApp
                  </span>
                )}
              </div>
            ))}
            <div className="flex items-start gap-2.5 text-cream-muted">
              <Clock size={16} className="mt-0.5 shrink-0 text-gold-soft" />
              <div className="space-y-0.5">
                {restaurant.hours.slice(0, 2).map((h) => (
                  <div key={h.day}>
                    {h.day}: {h.isClosed ? (lang === "ar" ? "مغلق" : "Closed") : `${h.open} - ${h.close}`}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-cream-dim">
          © {new Date().getFullYear()} {restaurant.name} —{" "}
          {lang === "ar" ? "جميع الحقوق محفوظة" : "All rights reserved"}
        </p>
      </div>
    </footer>
  );
}
