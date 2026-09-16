import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpDown, ExternalLink, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";

import { AiAssistant } from "@/components/aha/AiAssistant";
import { CountUp } from "@/components/aha/CountUp";
import { PageShell } from "@/components/aha/PageShell";
import { notify } from "@/components/aha/notify";
import { CATEGORIES, COMPLAINT_STATUSES, URGENCIES } from "@/lib/aha/data";
import { useAha } from "@/lib/aha/store";

type Search = {
  rec?: string | undefined;
  urgence?: string | undefined;
  statut?: string | undefined;
  est?: string | undefined;
};

export const Route = createFileRoute("/reclamations")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    rec: typeof search.rec === "string" ? search.rec : undefined,
    urgence: typeof search.urgence === "string" ? search.urgence : undefined,
    statut: typeof search.statut === "string" ? search.statut : undefined,
    est: typeof search.est === "string" ? search.est : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Gestion des réclamations — AHA Control" },
      {
        name: "description",
        content:
          "Suivi centralisé des réclamations voyageurs par établissement : catégorie, urgence, statut, notes internes et historique de traitement.",
      },
      { property: "og:title", content: "Gestion des réclamations — AHA Control" },
      {
        property: "og:description",
        content: "Filtrez, priorisez et clôturez les réclamations de tous vos établissements.",
      },
    ],
  }),
  component: ComplaintsPage,
});

const urgencyClass: Record<string, string> = {
  Faible: "bg-[oklch(0.93_0.05_150)] text-[oklch(0.4_0.12_150)]",
  Moyen: "bg-[oklch(0.94_0.07_75)] text-[oklch(0.45_0.13_62)]",
  Urgent: "bg-[oklch(0.93_0.06_25)] text-[oklch(0.45_0.18_25)]",
};
const statusClass: Record<string, string> = {
  Nouvelle: "bg-accent-soft text-primary-dark",
  "En cours": "bg-[oklch(0.94_0.05_240)] text-[oklch(0.42_0.12_255)]",
  Résolue: "bg-[oklch(0.93_0.05_150)] text-[oklch(0.4_0.12_150)]",
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

function ComplaintsPage() {
  const navigate = useNavigate();
  const searchParams = Route.useSearch();
  const { complaints, establishments, setComplaintStatus, setComplaintNotes } = useAha();

  const [query, setQuery] = useState("");
  const [est, setEst] = useState(searchParams.est ?? "all");
  const [category, setCategory] = useState("all");
  const [urgency, setUrgency] = useState(searchParams.urgence ?? "all");
  const [status, setStatus] = useState(searchParams.statut ?? "all");
  const [sort, setSort] = useState<"date" | "urgence">("date");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(searchParams.rec ?? null);
  const [noteDraft, setNoteDraft] = useState("");

  const nameOf = (id: string) => establishments.find((e) => e.id === id)?.name ?? "Établissement";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank = { Urgent: 0, Moyen: 1, Faible: 2 } as const;
    return complaints
      .filter((c) => {
        if (q && !`${c.client} ${c.message} ${nameOf(c.estId)}`.toLowerCase().includes(q)) return false;
        if (est !== "all" && c.estId !== est) return false;
        if (category !== "all" && c.category !== category) return false;
        if (urgency !== "all" && c.urgency !== urgency) return false;
        if (status !== "all" && c.status !== status) return false;
        return true;
      })
      .sort((a, b) =>
        sort === "urgence"
          ? rank[a.urgency] - rank[b.urgency]
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaints, query, est, category, urgency, status, sort, establishments]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const rows = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const open = complaints.find((c) => c.id === openId) ?? null;

  const urgentOpen = complaints.filter((c) => c.urgency === "Urgent" && c.status !== "Résolue").length;
  const resolvedMonth = complaints.filter((c) => c.status === "Résolue").length;

  const reset = () => {
    setQuery("");
    setEst("all");
    setCategory("all");
    setUrgency("all");
    setStatus("all");
    setSort("date");
    setPage(1);
    notify("Filtres réinitialisés", "La liste affiche à nouveau toutes les réclamations.");
  };

  const selectCls =
    "bg-card/80 border-border focus:ring-accent rounded-lg border px-3 py-2 text-xs outline-none focus:ring-2";

  return (
    <PageShell
      eyebrow="Qualité de service"
      title="Gestion des réclamations"
      subtitle="Chaque insatisfaction voyageur est tracée, priorisée et clôturée : catégorie, urgence, notes internes et historique de traitement."
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Réclamations urgentes ouvertes", value: urgentOpen, suffix: "" },
          { label: "Temps de résolution moyen", value: 6.4, suffix: " h", decimals: 1 },
          { label: "Réclamations résolues ce mois", value: resolvedMonth, suffix: "" },
        ].map((k, i) => (
          <motion.div
            key={k.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass lift rounded-2xl p-5"
          >
            <p className="font-display text-primary-dark text-3xl">
              <CountUp value={k.value} suffix={k.suffix} decimals={k.decimals ?? 0} />
            </p>
            <p className="text-muted-foreground mt-1 text-xs">{k.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="glass mb-4 rounded-2xl p-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Search className="text-muted-foreground h-4 w-4" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Rechercher un client, un établissement, un contenu…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={est}
              onChange={(e) => {
                setEst(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              <option value="all">Tous les établissements</option>
              {establishments.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </select>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              <option value="all">Toutes les catégories</option>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <select
              value={urgency}
              onChange={(e) => {
                setUrgency(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              <option value="all">Toutes urgences</option>
              {URGENCIES.map((u) => (
                <option key={u}>{u}</option>
              ))}
            </select>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className={selectCls}
            >
              <option value="all">Tous les statuts</option>
              {COMPLAINT_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setSort(sort === "date" ? "urgence" : "date")}
              className="shimmer border-primary/30 text-primary-dark flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
              Tri : {sort === "date" ? "Date" : "Urgence"}
            </button>
            <button
              type="button"
              onClick={reset}
              className="shimmer text-muted-foreground hover:text-primary flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser les filtres
            </button>
            <select
              value={perPage}
              onChange={(e) => {
                setPerPage(Number(e.target.value));
                setPage(1);
              }}
              className={`${selectCls} ml-auto`}
            >
              {[10, 25, 50].map((n) => (
                <option key={n} value={n}>
                  {n} / page
                </option>
              ))}
            </select>
          </div>
          <p className="text-muted-foreground text-xs">
            <span className="text-primary-dark font-semibold">{filtered.length}</span> réclamation
            {filtered.length > 1 ? "s" : ""} correspondent aux critères
          </p>
        </div>
      </div>

      <div className="glass scroll-warm overflow-x-auto rounded-2xl">
        {rows.length === 0 ? (
          <p className="text-muted-foreground p-10 text-center text-sm">
            Aucun résultat pour cette recherche
          </p>
        ) : (
          <table className="w-full min-w-[900px] text-left text-xs">
            <thead className="text-muted-foreground border-b text-[0.68rem] tracking-[0.14em] uppercase">
              <tr>
                <th className="p-3">Client</th>
                <th className="p-3">Établissement</th>
                <th className="p-3">Canal</th>
                <th className="p-3">Catégorie</th>
                <th className="p-3">Urgence</th>
                <th className="p-3">Statut</th>
                <th className="p-3">Créée le</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => (
                <motion.tr
                  key={c.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => {
                    setOpenId(c.id);
                    setNoteDraft(c.notes);
                  }}
                  className="hover:bg-accent-soft/40 cursor-pointer border-b transition-colors last:border-0"
                >
                  <td className="p-3 font-medium">{c.client}</td>
                  <td className="p-3">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({
                          to: "/service-client",
                          search: { est: c.estId, tab: "conversations" },
                        });
                      }}
                      className="bg-accent-soft text-primary-dark hover:bg-accent rounded-full px-2.5 py-1 text-[0.68rem] transition-colors"
                    >
                      {nameOf(c.estId)}
                    </button>
                  </td>
                  <td className="text-muted-foreground p-3">{c.channel}</td>
                  <td className="p-3">{c.category}</td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-[0.68rem] ${urgencyClass[c.urgency]}`}>
                      {c.urgency}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`rounded-full px-2.5 py-1 text-[0.68rem] ${statusClass[c.status]}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="text-muted-foreground p-3">{fmt(c.createdAt)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filtered.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Page {currentPage} sur {totalPages} — {filtered.length} résultats
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setPage(currentPage - 1)}
              className="shimmer rounded-lg border px-3 py-1.5 disabled:opacity-40"
            >
              Précédent
            </button>
            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setPage(currentPage + 1)}
              className="shimmer rounded-lg border px-3 py-1.5 disabled:opacity-40"
            >
              Suivant
            </button>
          </div>
        </div>
      )}

      {/* Detail panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpenId(null)}
              className="bg-primary-dark/25 fixed inset-0 z-50 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: 520 }}
              animate={{ x: 0 }}
              exit={{ x: 520 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="bg-background/97 scroll-warm fixed inset-y-0 right-0 z-50 w-full max-w-[520px] overflow-y-auto border-l backdrop-blur-xl"
            >
              <div className="hero-band flex items-start justify-between border-b p-5">
                <div>
                  <p className="text-primary text-[0.65rem] tracking-[0.24em] uppercase">
                    Réclamation {open.id}
                  </p>
                  <h2 className="font-display text-primary-dark mt-1 text-2xl">{open.client}</h2>
                  <p className="text-muted-foreground text-xs">
                    {nameOf(open.estId)} · {open.channel} · {fmt(open.createdAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenId(null)}
                  aria-label="Fermer"
                  className="hover:bg-background/70 rounded-full p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-5 p-5">
                <div className="flex flex-wrap gap-2 text-[0.68rem]">
                  <span className="bg-muted rounded-full px-2.5 py-1">{open.category}</span>
                  <span className={`rounded-full px-2.5 py-1 ${urgencyClass[open.urgency]}`}>
                    {open.urgency}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 ${statusClass[open.status]}`}>
                    {open.status}
                  </span>
                </div>

                <div className="glass rounded-xl p-4">
                  <p className="text-muted-foreground mb-1 text-[0.65rem] tracking-[0.2em] uppercase">
                    Message d'origine
                  </p>
                  <p className="text-sm leading-relaxed">{open.message}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {open.conversationId && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/service-client",
                          search: {
                            est: open.estId,
                            tab: "conversations",
                            conv: open.conversationId,
                          },
                        })
                      }
                      className="shimmer border-primary/30 text-primary-dark flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"
                    >
                      <ExternalLink className="h-3.5 w-3.5" /> Voir la conversation source
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      navigate({ to: "/service-client", search: { est: open.estId, tab: "conversations" } })
                    }
                    className="shimmer text-muted-foreground hover:text-primary rounded-lg border px-3 py-2 text-xs"
                  >
                    Espace de l'établissement
                  </button>
                </div>

                <div>
                  <p className="text-muted-foreground mb-1.5 text-[0.65rem] tracking-[0.2em] uppercase">
                    Notes internes
                  </p>
                  <textarea
                    value={noteDraft}
                    onChange={(e) => setNoteDraft(e.target.value)}
                    rows={4}
                    placeholder="Ajouter un élément de contexte pour l'équipe…"
                    className="bg-card/80 focus:ring-accent w-full rounded-xl border p-3 text-xs outline-none focus:ring-2"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setComplaintNotes(open.id, noteDraft);
                      notify("Notes internes enregistrées");
                    }}
                    className="shimmer bg-primary text-primary-foreground mt-2 rounded-lg px-3 py-2 text-xs"
                  >
                    Enregistrer les notes
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setComplaintStatus(open.id, "En cours");
                      notify("Réclamation prise en charge", `${open.client} — ${nameOf(open.estId)}`);
                    }}
                    className="shimmer from-primary-dark to-primary text-primary-foreground rounded-lg bg-gradient-to-r px-4 py-2 text-xs"
                  >
                    Prendre en charge
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setComplaintStatus(open.id, "Résolue");
                      notify("Réclamation résolue", "Le compteur du mois a été mis à jour.");
                    }}
                    className="shimmer border-primary/30 text-primary-dark rounded-lg border px-4 py-2 text-xs"
                  >
                    Marquer comme résolue
                  </button>
                </div>

                <div>
                  <p className="text-muted-foreground mb-2 text-[0.65rem] tracking-[0.2em] uppercase">
                    Historique
                  </p>
                  <ul className="space-y-2">
                    {open.history.map((h, i) => (
                      <li key={i} className="border-border/60 rounded-lg border p-2 text-[0.7rem]">
                        <span className="text-muted-foreground">{fmt(h.at)}</span> — {h.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <AiAssistant />
    </PageShell>
  );
}
