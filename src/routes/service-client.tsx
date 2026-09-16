import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpDown,
  Bot,
  Facebook,
  FileText,
  Globe,
  Instagram,
  Mail,
  MessageSquare,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { AiAssistant } from "@/components/aha/AiAssistant";
import { PageShell } from "@/components/aha/PageShell";
import { Magnetic } from "@/components/aha/Magnetic";
import { notify } from "@/components/aha/notify";
import {
  CATEGORIES,
  CHANNELS,
  CONV_STATUSES,
  IMAGES,
  REQUEST_TYPES,
  URGENCIES,
  type Category,
  type Conversation,
  type Establishment,
  type Urgency,
} from "@/lib/aha/data";
import { useAha } from "@/lib/aha/store";

type SearchParams = {
  est?: string | undefined;
  tab?: string | undefined;
  conv?: string | undefined;
  statut?: string | undefined;
};

export const Route = createFileRoute("/service-client")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    est: typeof search["est"] === "string" ? search["est"] : undefined,
    tab: typeof search["tab"] === "string" ? search["tab"] : undefined,
    conv: typeof search["conv"] === "string" ? search["conv"] : undefined,
    statut: typeof search["statut"] === "string" ? search["statut"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Service Client IA — AHA Control" },
      {
        name: "description",
        content:
          "Centralisez e-mails, WhatsApp et plateformes de réservation par établissement, pilotez l'agent IA de service client, la FAQ, les documents et les services.",
      },
      { property: "og:title", content: "Service Client IA — AHA Control" },
      {
        property: "og:description",
        content:
          "Un espace par établissement : conversations multicanal, base de connaissances et paramétrage de l'agent IA.",
      },
    ],
  }),
  component: ServiceClientPage,
});

const TABS = [
  { id: "conversations", label: "Conversations" },
  { id: "faq", label: "FAQ" },
  { id: "documents", label: "Documents" },
  { id: "services", label: "Services" },
  { id: "infos", label: "Infos générales" },
] as const;

const DAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

const fmt = (iso: string) =>
  new Date(iso).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const selectCls =
  "bg-card/80 border-border focus:ring-accent rounded-lg border px-3 py-2 text-xs outline-none focus:ring-2";
const inputCls =
  "bg-card/80 border-border focus:ring-accent w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2";

function ServiceClientPage() {
  const params = Route.useSearch();
  const { establishments } = useAha();
  const [selectedId, setSelectedId] = useState(params.est ?? establishments[0]?.id ?? "");
  const [tab, setTab] = useState<string>(params.tab ?? "conversations");
  const [estQuery, setEstQuery] = useState("");
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    if (params.est) setSelectedId(params.est);
    if (params.tab) setTab(params.tab);
  }, [params.est, params.tab]);

  const visibleEsts = establishments.filter((e) =>
    e.name.toLowerCase().includes(estQuery.trim().toLowerCase()),
  );
  const selected = establishments.find((e) => e.id === selectedId) ?? establishments[0];

  return (
    <PageShell
      eyebrow="Relation voyageur"
      title="Service Client IA"
      subtitle="Un espace par établissement : toutes les conversations e-mail, WhatsApp et plateformes de réservation réunies, et l'agent IA nourri par votre base de connaissances."
    >
      <EstablishmentSelector
        establishments={visibleEsts}
        total={establishments.length}
        query={estQuery}
        setQuery={setEstQuery}
        selectedId={selected?.id ?? ""}
        onSelect={(id) => {
          setSelectedId(id);
          setTab("conversations");
        }}
        onAdd={() => setAddOpen(true)}
      />

      {selected ? (
        <motion.div
          key={selected.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="mt-6"
        >
          <div className="glass relative overflow-hidden rounded-2xl">
            <div className="relative h-40 md:h-48">
              <img
                src={selected.image}
                alt={selected.name}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="from-primary-dark/90 absolute inset-0 bg-gradient-to-t to-transparent" />
              <div className="absolute bottom-4 left-5 text-white">
                <p className="text-[0.65rem] tracking-[0.24em] uppercase opacity-80">{selected.type}</p>
                <h2 className="font-display text-2xl md:text-3xl">{selected.name}</h2>
                <p className="text-xs opacity-85">{selected.city}</p>
              </div>
            </div>

            <div className="scroll-warm flex gap-1 overflow-x-auto border-b px-3 pt-3">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative shrink-0 px-4 py-3 text-[0.7rem] tracking-[0.14em] uppercase transition-colors ${
                    tab === t.id ? "text-primary-dark" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId="tab-underline"
                      className="bg-accent absolute inset-x-3 bottom-0 h-[2px] rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="p-4 md:p-5">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab + selected.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                >
                  {tab === "conversations" && (
                    <ConversationsTab est={selected} initialStatus={params.statut} initialConv={params.conv} />
                  )}
                  {tab === "faq" && <FaqTab est={selected} />}
                  {tab === "documents" && <DocumentsTab est={selected} />}
                  {tab === "services" && <ServicesTab est={selected} />}
                  {tab === "infos" && <InfoTab est={selected} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      ) : (
        <p className="text-muted-foreground mt-10 text-center text-sm">
          Aucun établissement pour le moment
        </p>
      )}

      <AnimatePresence>
        {addOpen && (
          <AddEstablishmentModal
            onClose={() => setAddOpen(false)}
            onCreated={(id) => {
              setSelectedId(id);
              setTab("conversations");
              setEstQuery("");
            }}
          />
        )}
      </AnimatePresence>

      <AiAssistant />
    </PageShell>
  );
}

/* ------------------------- Establishment selector ------------------------- */

function EstablishmentSelector({
  establishments,
  total,
  query,
  setQuery,
  selectedId,
  onSelect,
  onAdd,
}: {
  establishments: Establishment[];
  total: number;
  query: string;
  setQuery: (v: string) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
}) {
  const { conversations } = useAha();
  return (
    <section className="glass rounded-2xl p-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un établissement…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <span className="text-muted-foreground text-xs">
          <span className="text-primary-dark font-semibold">{establishments.length}</span> / {total}{" "}
          établissements
        </span>
      </div>

      <div className="scroll-warm mt-4 flex gap-3 overflow-x-auto pb-2">
        {establishments.map((e, i) => {
          const pending = conversations.filter(
            (c) => c.estId === e.id && c.status === "En attente d'intervention humaine",
          ).length;
          const active = e.id === selectedId;
          return (
            <motion.button
              key={e.id}
              type="button"
              onClick={() => onSelect(e.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`lift relative w-52 shrink-0 overflow-hidden rounded-xl border text-left ${
                active ? "border-accent ring-accent/60 ring-2" : "border-border bg-card/70"
              }`}
            >
              <img src={e.image} alt={e.name} loading="lazy" className="h-24 w-full object-cover" />
              {e.isNew && (
                <span className="bg-accent text-primary-dark absolute top-2 left-2 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold">
                  Nouveau
                </span>
              )}
              {pending > 0 && (
                <span className="bg-destructive text-destructive-foreground absolute top-2 right-2 rounded-full px-2 py-0.5 text-[0.6rem] font-semibold">
                  {pending} en attente
                </span>
              )}
              <div className="p-3">
                <p className="text-primary-dark truncate text-xs font-medium">{e.name}</p>
                <p className="text-muted-foreground truncate text-[0.68rem]">{e.city}</p>
              </div>
            </motion.button>
          );
        })}

        <Magnetic className="shrink-0">
          <button
            type="button"
            onClick={onAdd}
            className="shimmer border-primary/40 text-primary-dark hover:bg-accent-soft/50 flex h-full min-h-[9.5rem] w-52 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 text-xs"
          >
            <Plus className="h-5 w-5" />
            Ajouter un établissement
          </button>
        </Magnetic>
      </div>
      {establishments.length === 0 && (
        <p className="text-muted-foreground py-6 text-center text-sm">Aucun résultat pour cette recherche</p>
      )}
    </section>
  );
}

/* ------------------------------ Conversations ----------------------------- */

function ConversationsTab({
  est,
  initialStatus,
  initialConv,
}: {
  est: Establishment;
  initialStatus?: string | undefined;
  initialConv?: string | undefined;
}) {
  const { conversations, answerConversation, createComplaint } = useAha();
  const [query, setQuery] = useState("");
  const [channel, setChannel] = useState("all");
  const [status, setStatus] = useState(initialStatus ?? "all");
  const [type, setType] = useState("all");
  const [sort, setSort] = useState<"date" | "urgence">("date");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(initialConv ?? null);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [complaintForm, setComplaintForm] = useState<{ category: Category; urgency: Urgency } | null>(
    null,
  );

  useEffect(() => {
    setPage(1);
  }, [est.id]);

  const list = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rank = { Urgent: 0, Moyen: 1, Faible: 2 } as const;
    return conversations
      .filter((c) => c.estId === est.id)
      .filter((c) => {
        if (q && !`${c.client} ${c.preview} ${c.messages.map((m) => m.text).join(" ")}`.toLowerCase().includes(q))
          return false;
        if (channel !== "all" && c.channel !== channel) return false;
        if (status !== "all" && c.status !== status) return false;
        if (type !== "all" && c.type !== type) return false;
        return true;
      })
      .sort((a, b) =>
        sort === "urgence"
          ? rank[a.urgency] - rank[b.urgency]
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
  }, [conversations, est.id, query, channel, status, type, sort]);

  const totalPages = Math.max(1, Math.ceil(list.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const rows = list.slice((currentPage - 1) * perPage, currentPage * perPage);
  const open: Conversation | null = conversations.find((c) => c.id === openId) ?? null;

  return (
    <div>
      <div className="border-border/70 mb-4 space-y-3 rounded-xl border p-3">
        <div className="flex items-center gap-2">
          <Search className="text-muted-foreground h-4 w-4" />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Rechercher un client ou un contenu de message…"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={channel}
            onChange={(e) => {
              setChannel(e.target.value);
              setPage(1);
            }}
            className={selectCls}
          >
            <option value="all">Tous les canaux</option>
            {CHANNELS.map((c) => (
              <option key={c}>{c}</option>
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
            {CONV_STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className={selectCls}
          >
            <option value="all">Tous les types de demande</option>
            {REQUEST_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setSort(sort === "date" ? "urgence" : "date")}
            className="shimmer border-primary/30 text-primary-dark flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs"
          >
            <ArrowUpDown className="h-3.5 w-3.5" /> Tri : {sort === "date" ? "Date" : "Urgence"}
          </button>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setChannel("all");
              setStatus("all");
              setType("all");
              setSort("date");
              setPage(1);
              notify("Filtres réinitialisés");
            }}
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
          <span className="text-primary-dark font-semibold">{list.length}</span> conversation
          {list.length > 1 ? "s" : ""} affichée{list.length > 1 ? "s" : ""}
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-muted-foreground py-12 text-center text-sm">
          {list.length === 0 && query === "" && channel === "all" && status === "all" && type === "all"
            ? "Aucune conversation pour le moment"
            : "Aucun résultat pour cette recherche"}
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((c, i) => (
            <motion.li
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpenId(c.id);
                  setReply("");
                  setComplaintForm(null);
                }}
                className="border-border/70 hover:border-accent-glow hover:bg-accent-soft/40 flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors"
              >
                <span className="bg-accent-soft text-primary-dark mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg">
                  <MessageSquare className="h-3.5 w-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-primary-dark text-sm font-medium">{c.client}</span>
                    <span className="bg-muted rounded-full px-2 py-0.5 text-[0.62rem]">{c.channel}</span>
                    <span className="text-muted-foreground text-[0.62rem]">{c.type}</span>
                  </span>
                  <span className="text-muted-foreground mt-1 block truncate text-xs">{c.preview}</span>
                </span>
                <span className="shrink-0 text-right">
                  <span
                    className={`block rounded-full px-2 py-0.5 text-[0.62rem] ${
                      c.status === "En attente d'intervention humaine"
                        ? "bg-[oklch(0.93_0.06_25)] text-[oklch(0.45_0.18_25)]"
                        : c.status === "Clôturé"
                          ? "bg-muted text-muted-foreground"
                          : "bg-[oklch(0.93_0.05_150)] text-[oklch(0.4_0.12_150)]"
                    }`}
                  >
                    {c.status}
                  </span>
                  <span className="text-muted-foreground mt-1 block text-[0.62rem]">
                    {fmt(c.createdAt)}
                  </span>
                </span>
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {list.length > 0 && (
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            Page {currentPage} sur {totalPages} — {list.length} résultats
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

      {/* Conversation detail */}
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
              initial={{ x: 560 }}
              animate={{ x: 0 }}
              exit={{ x: 560 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="bg-background/97 scroll-warm fixed inset-y-0 right-0 z-50 w-full max-w-[560px] overflow-y-auto border-l backdrop-blur-xl"
            >
              <div className="hero-band flex items-start justify-between border-b p-5">
                <div>
                  <p className="text-primary text-[0.65rem] tracking-[0.24em] uppercase">
                    {open.channel} · {open.type}
                  </p>
                  <h3 className="font-display text-primary-dark mt-1 text-2xl">{open.client}</h3>
                  <p className="text-muted-foreground text-xs">
                    {est.name} · {fmt(open.createdAt)}
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

              <div className="space-y-4 p-5">
                <div className="space-y-3">
                  {open.messages.map((m) => (
                    <div
                      key={m.id}
                      className={`max-w-[88%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        m.from === "client"
                          ? "glass"
                          : m.from === "agent"
                            ? "bg-accent-soft/80 ml-auto"
                            : "bg-primary text-primary-foreground ml-auto"
                      }`}
                    >
                      {m.from === "agent" && (
                        <span className="text-primary-dark mb-1 flex items-center gap-1 text-[0.6rem] tracking-[0.14em] uppercase">
                          <Bot className="h-3 w-3" /> Réponse générée par l'agent IA
                        </span>
                      )}
                      {m.from === "human" && (
                        <span className="mb-1 block text-[0.6rem] tracking-[0.14em] uppercase opacity-80">
                          Réponse humaine — équipe AHA
                        </span>
                      )}
                      {m.text}
                      <span className="text-muted-foreground mt-1 block text-[0.6rem]">{fmt(m.at)}</span>
                    </div>
                  ))}
                  {sending && <div className="skeleton-shine h-12 w-2/3 rounded-2xl" />}
                </div>

                {open.status === "En attente d'intervention humaine" ? (
                  <div className="border-accent/60 bg-accent-soft/40 rounded-xl border p-3">
                    <p className="text-primary-dark mb-2 text-xs font-medium">Réponse manuelle</p>
                    <textarea
                      value={reply}
                      onChange={(e) => setReply(e.target.value)}
                      rows={4}
                      placeholder="Rédigez la réponse envoyée au voyageur…"
                      className={inputCls}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const text = reply.trim() || "Bonjour, notre responsable revient vers vous immédiatement.";
                        setSending(true);
                        setTimeout(() => {
                          answerConversation(open.id, text);
                          setSending(false);
                          setReply("");
                          notify("Réponse envoyée et conversation clôturée", `${open.client} — ${est.name}`);
                        }, 900);
                      }}
                      className="shimmer from-primary-dark to-primary text-primary-foreground mt-2 rounded-lg bg-gradient-to-r px-4 py-2 text-xs"
                    >
                      Envoyer et clôturer
                    </button>
                  </div>
                ) : (
                  <p className="text-muted-foreground text-xs">
                    Cette conversation est {open.status.toLowerCase()} — aucune action manuelle requise.
                  </p>
                )}

                {complaintForm ? (
                  <div className="glass space-y-2 rounded-xl p-3">
                    <p className="text-primary-dark text-xs font-medium">Transformer en réclamation</p>
                    <select
                      value={complaintForm.category}
                      onChange={(e) =>
                        setComplaintForm({ ...complaintForm, category: e.target.value as Category })
                      }
                      className={selectCls}
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <select
                      value={complaintForm.urgency}
                      onChange={(e) =>
                        setComplaintForm({ ...complaintForm, urgency: e.target.value as Urgency })
                      }
                      className={selectCls}
                    >
                      {URGENCIES.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          createComplaint({
                            estId: est.id,
                            client: open.client,
                            channel: open.channel,
                            category: complaintForm.category,
                            urgency: complaintForm.urgency,
                            message: open.messages[0]?.text ?? open.preview,
                            conversationId: open.id,
                          });
                          setComplaintForm(null);
                          notify(
                            "Réclamation créée",
                            `${complaintForm.category} · ${complaintForm.urgency} — visible dans Gestion des réclamations`,
                          );
                        }}
                        className="shimmer bg-primary text-primary-foreground rounded-lg px-3 py-2 text-xs"
                      >
                        Créer la réclamation
                      </button>
                      <button
                        type="button"
                        onClick={() => setComplaintForm(null)}
                        className="text-muted-foreground rounded-lg border px-3 py-2 text-xs"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setComplaintForm({ category: "Service sur place", urgency: "Moyen" })}
                    className="shimmer border-primary/30 text-primary-dark rounded-lg border px-4 py-2 text-xs"
                  >
                    Transformer en réclamation
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------------------------- FAQ ---------------------------------- */

function FaqTab({ est }: { est: Establishment }) {
  const { faqs, unanswered, addFaq, updateFaq, deleteFaq, removeUnanswered } = useAha();
  const items = faqs.filter((f) => f.estId === est.id);
  const missing = unanswered.filter((u) => u.estId === est.id);
  const [form, setForm] = useState<{ id?: string; question: string; answer: string; unansweredId?: string }>(
    { question: "", answer: "" },
  );
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-5">
      {missing.length > 0 && (
        <div className="border-accent bg-accent-soft/50 rounded-xl border p-4">
          <p className="text-primary-dark flex items-center gap-2 text-xs font-medium tracking-[0.16em] uppercase">
            <Sparkles className="h-3.5 w-3.5" /> Questions sans réponse détectées par l'agent
          </p>
          <ul className="mt-3 space-y-2">
            {missing.map((u) => (
              <motion.li
                key={u.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card/70 flex flex-wrap items-center justify-between gap-2 rounded-lg border p-2.5 text-xs"
              >
                <span>{u.question}</span>
                <button
                  type="button"
                  onClick={() => {
                    setForm({ question: u.question, answer: "", unansweredId: u.id });
                    setShowForm(true);
                  }}
                  className="shimmer bg-primary text-primary-foreground rounded-lg px-3 py-1.5"
                >
                  Ajouter à la FAQ
                </button>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          <span className="text-primary-dark font-semibold">{items.length}</span> entrées dans la base de
          connaissances
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ question: "", answer: "" });
            setShowForm(true);
          }}
          className="shimmer bg-primary text-primary-foreground flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter une question
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-2 rounded-xl p-4">
          <input
            value={form.question}
            onChange={(e) => setForm({ ...form, question: e.target.value })}
            placeholder="Question"
            className={inputCls}
          />
          <textarea
            value={form.answer}
            onChange={(e) => setForm({ ...form, answer: e.target.value })}
            rows={3}
            placeholder="Réponse utilisée par l'agent IA"
            className={inputCls}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!form.question.trim()) return;
                if (form.id) {
                  updateFaq(form.id, { question: form.question, answer: form.answer });
                  notify("Question mise à jour");
                } else {
                  addFaq({
                    estId: est.id,
                    question: form.question,
                    answer: form.answer || "Réponse à compléter",
                    status: "Publiée",
                  });
                  notify("Question ajoutée à la FAQ", "L'agent IA l'utilise dès maintenant.");
                }
                if (form.unansweredId) removeUnanswered(form.unansweredId);
                setShowForm(false);
                setForm({ question: "", answer: "" });
              }}
              className="shimmer from-primary-dark to-primary text-primary-foreground rounded-lg bg-gradient-to-r px-4 py-2 text-xs"
            >
              Valider
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-muted-foreground rounded-lg border px-4 py-2 text-xs"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      {items.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">Aucune question pour le moment</p>
      ) : (
        <ul className="space-y-2">
          {items.map((f, i) => (
            <motion.li
              key={f.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-border/70 lift rounded-xl border p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <p className="text-primary-dark text-sm font-medium">{f.question}</p>
                <span
                  className={`rounded-full px-2 py-0.5 text-[0.62rem] ${
                    f.status === "Publiée"
                      ? "bg-[oklch(0.93_0.05_150)] text-[oklch(0.4_0.12_150)]"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {f.status}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{f.answer}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-[0.68rem]">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ id: f.id, question: f.question, answer: f.answer });
                    setShowForm(true);
                  }}
                  className="text-primary hover:underline"
                >
                  Éditer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateFaq(f.id, { status: f.status === "Publiée" ? "Brouillon" : "Publiée" });
                    notify(f.status === "Publiée" ? "Passée en brouillon" : "Question publiée");
                  }}
                  className="text-primary hover:underline"
                >
                  {f.status === "Publiée" ? "Passer en brouillon" : "Publier"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteFaq(f.id);
                    notify("Question supprimée");
                  }}
                  className="text-destructive hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* -------------------------------- Documents ------------------------------- */

function DocumentsTab({ est }: { est: Establishment }) {
  const { docs, addDoc, deleteDoc } = useAha();
  const items = docs.filter((d) => d.estId === est.id);
  const [progress, setProgress] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const simulateUpload = (name: string) => {
    setProgress(0);
    const start = Date.now();
    const timer = setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / 1000) * 100);
      setProgress(p);
      if (p >= 100) {
        clearInterval(timer);
        setProgress(null);
        addDoc({
          estId: est.id,
          name,
          type: name.split(".").pop()?.toUpperCase() ?? "Fichier",
          addedAt: new Date().toISOString(),
        });
        notify("Document ajouté", name);
      }
    }, 80);
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files[0];
          simulateUpload(file?.name ?? "Nouveau document.pdf");
        }}
        className={`rounded-xl border border-dashed p-8 text-center transition-colors ${
          dragging ? "border-accent bg-accent-soft/50" : "border-primary/30"
        }`}
      >
        <Upload className="text-primary mx-auto mb-2 h-5 w-5" />
        <p className="text-xs">Glissez-déposez un document ou</p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="shimmer bg-primary text-primary-foreground mt-2 rounded-lg px-3 py-2 text-xs"
        >
          Parcourir les fichiers
        </button>
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            simulateUpload(f?.name ?? "Nouveau document.pdf");
          }}
        />
        {progress !== null && (
          <div className="bg-muted mx-auto mt-4 h-1.5 w-56 overflow-hidden rounded-full">
            <div
              className="from-primary to-accent h-full bg-gradient-to-r transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">Aucun document pour le moment</p>
      ) : (
        <ul className="space-y-2">
          {items.map((d, i) => (
            <motion.li
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-border/70 lift flex items-center gap-3 rounded-xl border p-3"
            >
              <span className="bg-accent-soft text-primary-dark grid h-8 w-8 place-items-center rounded-lg">
                <FileText className="h-4 w-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-primary-dark block truncate text-sm">{d.name}</span>
                <span className="text-muted-foreground text-[0.68rem]">
                  {d.type} · ajouté le {fmt(d.addedAt)}
                </span>
              </span>
              <button
                type="button"
                aria-label="Supprimer"
                onClick={() => {
                  deleteDoc(d.id);
                  notify("Document supprimé", d.name);
                }}
                className="text-destructive hover:bg-destructive/10 rounded-lg p-2"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* --------------------------------- Services ------------------------------- */

function ServicesTab({ est }: { est: Establishment }) {
  const { services, addService, updateService, deleteService } = useAha();
  const items = services.filter((s) => s.estId === est.id);
  const [form, setForm] = useState<{
    id?: string;
    name: string;
    description: string;
    status: "Disponible" | "Sur demande";
  }>({ name: "", description: "", status: "Disponible" });
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-xs">
          <span className="text-primary-dark font-semibold">{items.length}</span> prestations proposées
        </p>
        <button
          type="button"
          onClick={() => {
            setForm({ name: "", description: "", status: "Disponible" });
            setShowForm(true);
          }}
          className="shimmer bg-primary text-primary-foreground flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" /> Ajouter un service
        </button>
      </div>

      {showForm && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass space-y-2 rounded-xl p-4">
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nom du service"
            className={inputCls}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            placeholder="Courte description"
            className={inputCls}
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as "Disponible" | "Sur demande" })}
            className={selectCls}
          >
            <option>Disponible</option>
            <option>Sur demande</option>
          </select>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (!form.name.trim()) return;
                if (form.id) {
                  updateService(form.id, {
                    name: form.name,
                    description: form.description,
                    status: form.status,
                  });
                  notify("Service mis à jour", form.name);
                } else {
                  addService({
                    estId: est.id,
                    name: form.name,
                    description: form.description || "Prestation sur mesure.",
                    status: form.status,
                  });
                  notify("Service ajouté", form.name);
                }
                setShowForm(false);
              }}
              className="shimmer from-primary-dark to-primary text-primary-foreground rounded-lg bg-gradient-to-r px-4 py-2 text-xs"
            >
              Valider
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-muted-foreground rounded-lg border px-4 py-2 text-xs"
            >
              Annuler
            </button>
          </div>
        </motion.div>
      )}

      {items.length === 0 ? (
        <p className="text-muted-foreground py-10 text-center text-sm">Aucun service pour le moment</p>
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {items.map((s, i) => (
            <motion.li
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="border-border/70 lift rounded-xl border p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-primary-dark text-sm font-medium">{s.name}</p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.62rem] ${
                    s.status === "Disponible"
                      ? "bg-[oklch(0.93_0.05_150)] text-[oklch(0.4_0.12_150)]"
                      : "bg-accent-soft text-primary-dark"
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <p className="text-muted-foreground mt-1.5 text-xs">{s.description}</p>
              <div className="mt-2 flex gap-3 text-[0.68rem]">
                <button
                  type="button"
                  onClick={() => {
                    setForm({ id: s.id, name: s.name, description: s.description, status: s.status });
                    setShowForm(true);
                  }}
                  className="text-primary hover:underline"
                >
                  Éditer
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteService(s.id);
                    notify("Service supprimé", s.name);
                  }}
                  className="text-destructive hover:underline"
                >
                  Supprimer
                </button>
              </div>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ------------------------------ Infos générales --------------------------- */

function InfoTab({ est }: { est: Establishment }) {
  const { updateEstablishment } = useAha();
  const [draft, setDraft] = useState<Establishment>(est);

  useEffect(() => setDraft(est), [est]);

  const toggleDay = (d: string) =>
    setDraft({
      ...draft,
      hours: {
        ...draft.hours,
        days: draft.hours.days.includes(d)
          ? draft.hours.days.filter((x) => x !== d)
          : [...draft.hours.days, d],
      },
    });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nom de l'établissement">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Ville / adresse">
          <input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Site web" icon={<Globe className="h-3.5 w-3.5" />}>
          <input value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} className={inputCls} />
        </Field>
        <Field label="E-mail dédié utilisé par l'agent" icon={<Mail className="h-3.5 w-3.5" />}>
          <input value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Instagram" icon={<Instagram className="h-3.5 w-3.5" />}>
          <input value={draft.instagram} onChange={(e) => setDraft({ ...draft, instagram: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Facebook" icon={<Facebook className="h-3.5 w-3.5" />}>
          <input value={draft.facebook} onChange={(e) => setDraft({ ...draft, facebook: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Autre lien (WhatsApp, TripAdvisor…)">
          <input value={draft.other} onChange={(e) => setDraft({ ...draft, other: e.target.value })} className={inputCls} />
        </Field>
        <Field label="Description utilisée par l'agent">
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            rows={3}
            className={inputCls}
          />
        </Field>
      </div>

      <div>
        <p className="text-muted-foreground mb-2 text-[0.65rem] tracking-[0.2em] uppercase">
          Horaires d'ouverture de la réception
        </p>
        <div className="flex flex-wrap items-center gap-2">
          {DAYS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => toggleDay(d)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                draft.hours.days.includes(d)
                  ? "border-accent bg-accent-soft text-primary-dark"
                  : "text-muted-foreground"
              }`}
            >
              {d}
            </button>
          ))}
          <input
            type="time"
            value={draft.hours.from}
            onChange={(e) => setDraft({ ...draft, hours: { ...draft.hours, from: e.target.value } })}
            className={selectCls}
          />
          <span className="text-muted-foreground text-xs">à</span>
          <input
            type="time"
            value={draft.hours.to}
            onChange={(e) => setDraft({ ...draft, hours: { ...draft.hours, to: e.target.value } })}
            className={selectCls}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            updateEstablishment(est.id, draft);
            notify(
              "Informations enregistrées",
              "Ces informations alimentent la base de connaissances utilisée par l'agent IA.",
            );
          }}
          className="shimmer from-primary-dark to-primary text-primary-foreground rounded-lg bg-gradient-to-r px-4 py-2.5 text-xs"
        >
          Enregistrer les informations
        </button>
        <span className="text-muted-foreground text-[0.68rem]" title="Ces données nourrissent l'agent IA">
          Ces informations alimentent la base de connaissances de l'agent de cet établissement.
        </span>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-muted-foreground flex items-center gap-1.5 text-[0.65rem] tracking-[0.18em] uppercase">
        {icon}
        {label}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

/* ------------------------- Add establishment modal ------------------------ */

function AddEstablishmentModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const { addEstablishment } = useAha();
  const [form, setForm] = useState({
    name: "",
    type: "Maison d'hôtes",
    city: "Marrakech",
    description: "",
    website: "",
    email: "",
    instagram: "",
    facebook: "",
    other: "",
    image: IMAGES[0]!,
    from: "08:00",
    to: "20:00",
    days: [...DAYS],
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="bg-primary-dark/30 fixed inset-0 z-50 backdrop-blur-[3px]"
      />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        className="bg-background/98 scroll-warm fixed inset-x-4 top-10 bottom-10 z-50 mx-auto max-w-2xl overflow-y-auto rounded-2xl border shadow-2xl backdrop-blur-xl"
      >
        <div className="hero-band flex items-start justify-between border-b p-5">
          <div>
            <p className="text-primary text-[0.65rem] tracking-[0.24em] uppercase">Paramétrage</p>
            <h3 className="font-display text-primary-dark text-2xl">Ajouter un établissement</h3>
          </div>
          <button type="button" onClick={onClose} aria-label="Fermer" className="hover:bg-background/70 rounded-full p-2">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nom de l'établissement">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputCls} placeholder="Riad…" />
            </Field>
            <Field label="Type">
              <input value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Ville / adresse">
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Site web">
              <input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inputCls} />
            </Field>
            <Field label="E-mail dédié de l'agent">
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Instagram">
              <input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Facebook">
              <input value={form.facebook} onChange={(e) => setForm({ ...form, facebook: e.target.value })} className={inputCls} />
            </Field>
            <Field label="Autre lien">
              <input value={form.other} onChange={(e) => setForm({ ...form, other: e.target.value })} className={inputCls} />
            </Field>
          </div>

          <Field label="Description utilisée par l'agent">
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className={inputCls}
            />
          </Field>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.65rem] tracking-[0.2em] uppercase">
              Photo de couverture
            </p>
            <div className="flex gap-2">
              {IMAGES.map((img) => (
                <button
                  key={img}
                  type="button"
                  onClick={() => setForm({ ...form, image: img })}
                  className={`h-16 w-24 overflow-hidden rounded-lg border-2 ${
                    form.image === img ? "border-accent" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-muted-foreground mb-2 text-[0.65rem] tracking-[0.2em] uppercase">
              Horaires d'ouverture
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      days: form.days.includes(d) ? form.days.filter((x) => x !== d) : [...form.days, d],
                    })
                  }
                  className={`rounded-full border px-3 py-1.5 text-xs ${
                    form.days.includes(d)
                      ? "border-accent bg-accent-soft text-primary-dark"
                      : "text-muted-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
              <input
                type="time"
                value={form.from}
                onChange={(e) => setForm({ ...form, from: e.target.value })}
                className={selectCls}
              />
              <span className="text-muted-foreground text-xs">à</span>
              <input
                type="time"
                value={form.to}
                onChange={(e) => setForm({ ...form, to: e.target.value })}
                className={selectCls}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              const created = addEstablishment({
                name: form.name.trim() || "Nouvel établissement",
                type: form.type,
                city: form.city,
                description: form.description || "Établissement récemment intégré au portefeuille AHA.",
                website: form.website,
                email: form.email || "contact@atlashospitalityadvisory.com",
                hours: { days: form.days, from: form.from, to: form.to },
                instagram: form.instagram,
                facebook: form.facebook,
                other: form.other,
                image: form.image,
              });
              onCreated(created.id);
              onClose();
              notify("Établissement ajouté", `${created.name} est désormais sélectionné.`);
            }}
            className="shimmer from-primary-dark to-primary text-primary-foreground w-full rounded-lg bg-gradient-to-r py-3 text-sm"
          >
            Valider et créer l'établissement
          </button>
        </div>
      </motion.div>
    </>
  );
}
