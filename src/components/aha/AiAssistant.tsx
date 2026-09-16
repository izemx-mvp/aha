import { AnimatePresence, motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { Magnetic } from "./Magnetic";
import { useAha } from "@/lib/aha/store";
import type { Complaint, Conversation, Establishment, Unanswered } from "@/lib/aha/data";

const SUGGESTIONS = [
  "Quel établissement reçoit le plus de réclamations ce mois-ci ?",
  "Combien de conversations sont en attente d'intervention humaine ?",
  "Quelles questions reviennent souvent sans réponse dans la base de connaissances ?",
  "Quel est le taux de réponse automatique de l'agent ?",
  "Combien de réclamations urgentes sont encore ouvertes ?",
];

type Data = {
  establishments: Establishment[];
  conversations: Conversation[];
  complaints: Complaint[];
  unanswered: Unanswered[];
};

export function getAssistantReply(question: string, data: Data): string {
  const q = question.toLowerCase();
  const nameOf = (id: string) => data.establishments.find((e) => e.id === id)?.name ?? "—";

  if (q.includes("réclamation") && (q.includes("plus") || q.includes("établissement"))) {
    const counts = new Map<string, number>();
    data.complaints.forEach((c) => counts.set(c.estId, (counts.get(c.estId) ?? 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return `Sur la période en cours, ${nameOf(top[0]?.[0] ?? "")} arrive en tête avec ${top[0]?.[1] ?? 0} réclamations. Viennent ensuite ${top
      .slice(1)
      .map(([id, n]) => `${nameOf(id)} (${n})`)
      .join(", ")}.`;
  }
  if (q.includes("attente") || q.includes("humain")) {
    const pending = data.conversations.filter(
      (c) => c.status === "En attente d'intervention humaine",
    );
    const byEst = new Map<string, number>();
    pending.forEach((c) => byEst.set(c.estId, (byEst.get(c.estId) ?? 0) + 1));
    const top = [...byEst.entries()].sort((a, b) => b[1] - a[1])[0];
    return `${pending.length} conversations attendent une intervention humaine, tous canaux confondus. Le volume le plus important concerne ${nameOf(
      top?.[0] ?? "",
    )} (${top?.[1] ?? 0} conversations).`;
  }
  if (q.includes("sans réponse") || q.includes("base de connaissances") || q.includes("faq")) {
    const counts = new Map<string, number>();
    data.unanswered.forEach((u) => counts.set(u.question, (counts.get(u.question) ?? 0) + 1));
    const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return `Les questions les plus fréquemment détectées sans réponse sont : ${top
      .map(([q2, n]) => `« ${q2} » (${n} établissements)`)
      .join(", ")}. Ajoutez-les à la FAQ de chaque établissement pour améliorer l'agent.`;
  }
  if (q.includes("urgent")) {
    const urgent = data.complaints.filter((c) => c.urgency === "Urgent" && c.status !== "Résolue");
    return `${urgent.length} réclamations urgentes sont encore ouvertes, dont ${
      urgent.filter((c) => c.status === "Nouvelle").length
    } non encore prises en charge. La plus ancienne concerne ${nameOf(urgent[urgent.length - 1]?.estId ?? "")}.`;
  }
  if (q.includes("taux") || q.includes("automatique")) {
    const total = data.conversations.length;
    const auto = data.conversations.filter((c) => c.status !== "En attente d'intervention humaine").length;
    return `L'agent traite ${Math.round((auto / total) * 100)}% des conversations sans intervention humaine (${auto} sur ${total}). Les demandes de disponibilité et de suivi de réservation sont les mieux automatisées.`;
  }
  if (q.includes("canal") || q.includes("whatsapp") || q.includes("email")) {
    const byChannel = new Map<string, number>();
    data.conversations.forEach((c) => byChannel.set(c.channel, (byChannel.get(c.channel) ?? 0) + 1));
    return `Répartition par canal : ${[...byChannel.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([c, n]) => `${c} ${n}`)
      .join(" · ")}.`;
  }
  if (q.includes("établissement") || q.includes("combien")) {
    return `${data.establishments.length} établissements sont actifs dans AHA Control, pour ${data.conversations.length} conversations centralisées et ${data.complaints.length} réclamations suivies.`;
  }
  return `Je n'ai pas de réponse chiffrée directe à cette question. Voici l'essentiel : ${data.establishments.length} établissements, ${data.conversations.length} conversations centralisées, ${
    data.conversations.filter((c) => c.status === "En attente d'intervention humaine").length
  } en attente d'intervention humaine et ${data.complaints.filter((c) => c.status !== "Résolue").length} réclamations ouvertes.`;
}

type Msg = { id: number; from: "user" | "ai"; text: string };

export function AiAssistant() {
  const { establishments, conversations, complaints, unanswered } = useAha();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const ask = (question: string) => {
    const text = question.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text }]);
    setInput("");
    setTyping(true);
    setTimeout(
      () => {
        const reply = getAssistantReply(text, {
          establishments,
          conversations,
          complaints,
          unanswered,
        });
        setTyping(false);
        setMessages((prev) => [...prev, { id: Date.now() + 1, from: "ai", text: reply }]);
      },
      800 + Math.random() * 400,
    );
  };

  return (
    <>
      <Magnetic className="fixed right-5 bottom-5 z-50">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="shimmer glow-pulse from-primary-dark to-primary text-primary-foreground flex items-center gap-2 rounded-full bg-gradient-to-r px-5 py-3 text-xs font-medium tracking-wide shadow-lg"
        >
          <Sparkles className="h-4 w-4" />
          Demander à l'assistant IA
        </button>
      </Magnetic>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="bg-primary-dark/25 fixed inset-0 z-50 backdrop-blur-[2px]"
            />
            <motion.aside
              initial={{ x: 420 }}
              animate={{ x: 0 }}
              exit={{ x: 420 }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="bg-background/95 fixed inset-y-0 right-0 z-50 flex w-full max-w-[400px] flex-col border-l backdrop-blur-xl"
            >
              <div className="hero-band flex items-center justify-between border-b px-5 py-4">
                <div>
                  <p className="font-display text-primary-dark text-lg">Assistant IA</p>
                  <p className="text-muted-foreground text-xs">Analyse de vos données AHA Control</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Fermer"
                  className="hover:bg-background/70 rounded-full p-2"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="scroll-warm flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs">Questions suggérées :</p>
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => ask(s)}
                        className="glass lift block w-full rounded-xl p-3 text-left text-xs"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                )}
                {messages.map((m) => (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[92%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      m.from === "user"
                        ? "bg-primary text-primary-foreground ml-auto"
                        : "glass text-foreground"
                    }`}
                  >
                    {m.text}
                  </motion.div>
                ))}
                {typing && (
                  <div className="text-muted-foreground flex items-center gap-2 text-xs">
                    <span className="skeleton-shine h-3 w-32 rounded-full" />
                    L'assistant écrit…
                  </div>
                )}
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                }}
                className="flex items-center gap-2 border-t p-3"
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Posez votre question…"
                  className="bg-card/80 focus:ring-accent flex-1 rounded-full border px-4 py-2 text-xs outline-none focus:ring-2"
                />
                <button
                  type="submit"
                  aria-label="Envoyer"
                  className="shimmer bg-primary text-primary-foreground rounded-full p-2.5"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
