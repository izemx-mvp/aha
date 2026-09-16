import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { AppHeader } from "./AppHeader";
import { Backdrop } from "./Backdrop";
import { CONTACT } from "@/lib/aha/data";
import { Logo } from "./Logo";

export function PageShell({
  title,
  subtitle,
  eyebrow,
  children,
  actions,
}: {
  title: string;
  subtitle: string;
  eyebrow?: string;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <Backdrop />
      <div className="relative z-10 flex min-h-screen flex-col">
        <AppHeader />
        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="flex flex-1 flex-col"
        >
          <section className="hero-band border-b">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between md:py-14">
              <div className="min-w-0">
                {eyebrow && (
                  <p className="text-primary mb-2 text-[0.65rem] tracking-[0.3em] uppercase">
                    {eyebrow}
                  </p>
                )}
                <h1 className="font-display text-primary-dark text-3xl leading-tight md:text-5xl">
                  {title}
                </h1>
                <p className="text-muted-foreground mt-3 max-w-2xl text-sm md:text-base">{subtitle}</p>
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </section>

          <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 md:py-10">{children}</div>

          <footer className="border-t">
            <div className="text-muted-foreground mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-xs sm:px-6 md:flex-row md:items-center md:justify-between">
              <div className="text-primary-dark flex items-center gap-3">
                <Logo size={26} />
                <span className="text-muted-foreground">Atlas Hospitality Advisory — Marrakech</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                <a className="hover:text-primary" href={`tel:${CONTACT.phone.replace(/\s/g, "")}`}>
                  {CONTACT.phone}
                </a>
                <a className="hover:text-primary" href={`mailto:${CONTACT.email}`}>
                  {CONTACT.email}
                </a>
                <a className="hover:text-primary" href={CONTACT.instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
                <a className="hover:text-primary" href={CONTACT.linkedin} target="_blank" rel="noreferrer">
                  LinkedIn
                </a>
                <a className="hover:text-primary" href={CONTACT.website} target="_blank" rel="noreferrer">
                  atlashospitalityadvisory.com
                </a>
              </div>
            </div>
          </footer>
        </motion.main>
      </div>
    </div>
  );
}
