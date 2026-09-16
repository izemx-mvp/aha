import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, LogOut, Menu, Search, User, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Logo } from "./Logo";
import { useAha } from "@/lib/aha/store";
import { CONTACT } from "@/lib/aha/data";

const NAV = [
  { to: "/dashboard", label: "Tableau de bord" },
  { to: "/service-client", label: "Service Client IA" },
  { to: "/reclamations", label: "Gestion des réclamations" },
] as const;

export function AppHeader() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { establishments, conversations, complaints } = useAha();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
    setAvatarOpen(false);
  }, [pathname]);

  const pendingHuman = conversations.filter(
    (c) => c.status === "En attente d'intervention humaine",
  ).length;
  const urgentOpen = complaints.filter((c) => c.urgency === "Urgent" && c.status !== "Résolue").length;
  const notifCount = pendingHuman + urgentOpen;

  const matches = query.trim()
    ? establishments.filter((e) => e.name.toLowerCase().includes(query.trim().toLowerCase()))
    : [];

  const goTo = (estId: string) => {
    setQuery("");
    setSearchOpen(false);
    navigate({ to: "/service-client", search: { est: estId, tab: "conversations" } });
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "border-border/70 bg-background/70 shadow-[0_8px_24px_-18px_rgba(74,56,38,0.5)] backdrop-blur-xl"
          : "border-transparent bg-background/45 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link to="/dashboard" className="text-primary-dark shrink-0 transition-opacity hover:opacity-75">
          <Logo />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-4 py-2 text-[0.68rem] tracking-[0.18em] uppercase transition-colors ${
                  active ? "text-primary-dark" : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
                {active && (
                  <motion.span
                    layoutId="nav-underline"
                    className="bg-accent absolute inset-x-3 -bottom-0.5 h-[2px] rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {/* Quick search */}
          <div className="relative">
            <div className="flex items-center">
              <button
                type="button"
                aria-label="Recherche rapide"
                onClick={() => {
                  setSearchOpen((v) => !v);
                  setTimeout(() => inputRef.current?.focus(), 60);
                }}
                className="text-muted-foreground hover:text-primary hover:bg-muted/70 rounded-full p-2 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
              <motion.div
                animate={{ width: searchOpen ? 190 : 0, opacity: searchOpen ? 1 : 0 }}
                initial={false}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && matches[0]) goTo(matches[0].id);
                    if (e.key === "Escape") setSearchOpen(false);
                  }}
                  placeholder="Aller à un établissement…"
                  className="border-border/70 bg-card/80 focus:ring-accent w-full rounded-full border px-3 py-1.5 text-xs outline-none focus:ring-2"
                />
              </motion.div>
            </div>
            <AnimatePresence>
              {searchOpen && matches.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="glass scroll-warm absolute right-0 mt-2 max-h-72 w-72 overflow-y-auto rounded-xl p-1"
                >
                  {matches.map((e) => (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => goTo(e.id)}
                        className="hover:bg-accent-soft/70 w-full rounded-lg px-3 py-2 text-left text-xs transition-colors"
                      >
                        <span className="block font-medium">{e.name}</span>
                        <span className="text-muted-foreground">{e.city}</span>
                      </button>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              type="button"
              aria-label="Notifications"
              onClick={() => setNotifOpen((v) => !v)}
              className="text-muted-foreground hover:text-primary hover:bg-muted/70 relative rounded-full p-2 transition-colors"
            >
              <Bell className="h-4 w-4" />
              {notifCount > 0 && (
                <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[0.6rem] font-semibold">
                  {notifCount}
                </span>
              )}
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="glass absolute right-0 mt-2 w-80 rounded-xl p-3"
                >
                  <p className="font-display text-primary-dark mb-2 text-sm">Dernières activités</p>
                  <ul className="scroll-warm max-h-72 space-y-2 overflow-y-auto pr-1 text-xs">
                    <li className="border-border/60 rounded-lg border p-2">
                      <span className="font-medium">{pendingHuman} conversations</span> en attente
                      d'intervention humaine
                    </li>
                    <li className="border-border/60 rounded-lg border p-2">
                      <span className="text-destructive font-medium">{urgentOpen} réclamations</span>{" "}
                      urgentes encore ouvertes
                    </li>
                    {complaints.slice(0, 4).map((c) => {
                      const est = establishments.find((e) => e.id === c.estId);
                      return (
                        <li key={c.id}>
                          <button
                            type="button"
                            onClick={() => {
                              setNotifOpen(false);
                              navigate({ to: "/reclamations", search: { rec: c.id } });
                            }}
                            className="hover:bg-accent-soft/60 w-full rounded-lg px-2 py-1.5 text-left transition-colors"
                          >
                            <span className="font-medium">{c.category}</span> — {est?.name} ·{" "}
                            <span className="text-muted-foreground">{c.urgency}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAvatarOpen((v) => !v)}
              className="hover:bg-muted/70 flex items-center gap-2 rounded-full py-1 pr-2 pl-1 transition-colors"
            >
              <span className="from-primary to-accent text-primary-foreground font-display grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br text-xs">
                RB
              </span>
              <span className="hidden text-left text-[0.7rem] leading-tight lg:block">
                <span className="block font-medium">Rachid Baliti</span>
                <span className="text-muted-foreground">AHA</span>
              </span>
              <ChevronDown className="text-muted-foreground h-3 w-3" />
            </button>
            <AnimatePresence>
              {avatarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="glass absolute right-0 mt-2 w-64 rounded-xl p-3 text-xs"
                >
                  <p className="font-display text-primary-dark text-sm">Rachid Baliti</p>
                  <p className="text-muted-foreground">Fondateur — Atlas Hospitality Advisory</p>
                  <div className="text-muted-foreground my-2 space-y-1 border-y py-2">
                    <p>{CONTACT.phone}</p>
                    <p className="break-all">{CONTACT.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/" })}
                    className="text-primary-dark hover:bg-accent-soft/70 flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors"
                  >
                    <User className="h-3.5 w-3.5" /> Profil
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate({ to: "/" })}
                    className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-lg px-2 py-2 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" /> Déconnexion
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-primary-dark hover:bg-muted/70 rounded-full p-2 transition-colors md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="bg-background/90 overflow-hidden border-t backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-col p-3">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hover:bg-accent-soft/60 rounded-lg px-3 py-3 text-[0.72rem] tracking-[0.18em] uppercase"
                  activeProps={{ className: "bg-accent-soft/80 text-primary-dark" }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
