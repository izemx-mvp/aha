import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Lock, Mail, Sparkles } from "lucide-react";
import { useState } from "react";

import loginImage from "@/assets/login-riad.jpg";
import { Backdrop } from "@/components/aha/Backdrop";
import { Logo } from "@/components/aha/Logo";
import { Magnetic } from "@/components/aha/Magnetic";
import { notify } from "@/components/aha/notify";
import { CONTACT } from "@/lib/aha/data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AHA Control — Connexion au backoffice" },
      {
        name: "description",
        content:
          "Connexion à AHA Control, le backoffice d'Atlas Hospitality Advisory : communications voyageurs, agent IA et réclamations centralisés.",
      },
      { property: "og:title", content: "AHA Control — Connexion au backoffice" },
      {
        property: "og:description",
        content: "Toutes vos communications voyageurs, sur tous vos établissements, dans un seul endroit.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(CONTACT.email);
  const [password, setPassword] = useState("AHA@2026");

  const enter = (label: string) => {
    notify("Connexion réussie", label);
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative grid min-h-screen w-full grid-cols-1 lg:grid-cols-2">
      <Backdrop />

      <div className="relative z-10 flex items-center justify-center px-6 py-12 sm:px-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="text-primary-dark mb-10">
            <Logo size={44} spin />
          </div>

          <p className="text-primary mb-3 text-[0.65rem] tracking-[0.32em] uppercase">
            Atlas Hospitality Advisory
          </p>
          <h1 className="font-display text-primary-dark text-4xl leading-tight">
            Bienvenue dans <span className="text-gradient-warm">AHA Control</span>
          </h1>
          <p className="text-muted-foreground mt-3 text-sm">
            Pilotez la relation voyageur de tous vos établissements, canal par canal, depuis une seule
            console.
          </p>

          <form
            className="mt-8 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              enter("Bienvenue Rachid Baliti");
            }}
          >
            <label className="block">
              <span className="text-muted-foreground text-xs tracking-wide uppercase">Email</span>
              <div className="glass mt-1.5 flex items-center gap-2 rounded-xl px-3 py-2.5">
                <Mail className="text-primary h-4 w-4 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <label className="block">
              <span className="text-muted-foreground text-xs tracking-wide uppercase">
                Mot de passe
              </span>
              <div className="glass mt-1.5 flex items-center gap-2 rounded-xl px-3 py-2.5">
                <Lock className="text-primary h-4 w-4 shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                />
              </div>
            </label>

            <Magnetic className="block w-full">
              <button
                type="submit"
                className="shimmer from-primary-dark to-primary text-primary-foreground flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-3 text-sm font-medium tracking-wide"
              >
                Se connecter <ArrowRight className="h-4 w-4" />
              </button>
            </Magnetic>
          </form>

          <div className="border-accent bg-accent-soft/60 mt-8 rounded-xl border p-4">
            <p className="text-primary-dark flex items-center gap-2 text-xs font-medium tracking-[0.2em] uppercase">
              <Sparkles className="h-3.5 w-3.5" /> Accès démonstration
            </p>
            <p className="text-muted-foreground mt-2 text-xs">
              Environnement de démonstration alimenté par des données fictives cohérentes.
            </p>
            <button
              type="button"
              onClick={() => enter("Accès démonstration activé")}
              className="shimmer border-primary/40 text-primary-dark hover:bg-background/70 mt-3 w-full rounded-lg border py-2.5 text-sm font-medium"
            >
              Connexion instantanée (démo)
            </button>
          </div>

          <p className="text-muted-foreground mt-8 text-xs">
            {CONTACT.phone} · {CONTACT.email}
          </p>
        </motion.div>
      </div>

      <div className="relative hidden overflow-hidden lg:block">
        <img
          src={loginImage}
          alt="Patio de riad marocain avec arcs en fer à cheval, zelliges et tentures dorées"
          width={1280}
          height={1600}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="from-primary-dark/95 via-primary-dark/55 absolute inset-0 bg-gradient-to-t to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h2 className="font-display text-4xl text-white">AHA Control</h2>
            <p className="mt-3 max-w-md text-sm text-white/80">
              Toutes vos communications voyageurs, sur tous vos établissements, dans un seul endroit.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
