import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bot,
  Building2,
  MessageSquare,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { AiAssistant } from "@/components/aha/AiAssistant";
import { CountUp } from "@/components/aha/CountUp";
import { PageShell } from "@/components/aha/PageShell";
import { useAha } from "@/lib/aha/store";
import { MESSAGE_VOLUME } from "@/lib/aha/data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Tableau de bord — AHA Control" },
      {
        name: "description",
        content:
          "Vue d'ensemble des messages voyageurs traités, du taux de réponse automatique de l'agent IA et des réclamations urgentes pour les établissements gérés par AHA.",
      },
      { property: "og:title", content: "Tableau de bord — AHA Control" },
      {
        property: "og:description",
        content: "Volume de messages, performance de l'agent IA et activité récente en temps réel.",
      },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const navigate = useNavigate();
  const { establishments, conversations, complaints } = useAha();

  const pendingHuman = conversations.filter((c) => c.status === "En attente d'intervention humaine");
  const urgentOpen = complaints.filter((c) => c.urgency === "Urgent" && c.status !== "Résolue");
  const autoRate = Math.round(
    ((conversations.length - pendingHuman.length) / Math.max(1, conversations.length)) * 100,
  );
  const todayMessages = conversations.reduce((acc, c) => acc + c.messages.length, 0);

  const kpis: Array<{
    label: string;
    value: number;
    suffix?: string;
    icon: LucideIcon;
    onClick: () => void;
    hint: string;
  }> = [
    {
      label: "Messages traités aujourd'hui",
      value: todayMessages,
      icon: MessageSquare,
      hint: "Tous canaux confondus",
      onClick: () => navigate({ to: "/service-client", search: { tab: "conversations" } }),
    },
    {
      label: "Taux de réponse automatique de l'agent",
      value: autoRate,
      suffix: " %",
      icon: Bot,
      hint: "Sans intervention humaine",
      onClick: () => navigate({ to: "/service-client", search: { tab: "conversations" } }),
    },
    {
      label: "Réclamations urgentes ouvertes",
      value: urgentOpen.length,
      icon: AlertTriangle,
      hint: "À traiter en priorité",
      onClick: () => navigate({ to: "/reclamations", search: { urgence: "Urgent" } }),
    },
    {
      label: "Établissements actifs",
      value: establishments.length,
      icon: Building2,
      hint: "Sous gestion AHA",
      onClick: () => navigate({ to: "/service-client", search: {} }),
    },
    {
      label: "Conversations en attente d'intervention humaine",
      value: pendingHuman.length,
      icon: UserCog,
      hint: "Reprises manuelles",
      onClick: () =>
        navigate({
          to: "/service-client",
          search: { tab: "conversations", statut: "En attente d'intervention humaine" },
        }),
    },
  ];

  const chartData = MESSAGE_VOLUME.filter((m) => establishments.some((e) => e.id === m.estId));

  const activity = [
    {
      label: "Réponse automatique envoyée",
      detail: "Riad Villa Saphir & Spa — WhatsApp",
      time: "il y a 12 min",
      go: () => navigate({ to: "/service-client", search: { est: "est-1", tab: "conversations" } }),
    },
    {
      label: "Réclamation urgente créée",
      detail: "Palais Menzah — Service sur place",
      time: "il y a 40 min",
      go: () => navigate({ to: "/reclamations", search: { urgence: "Urgent" } }),
    },
    {
      label: "Conversation reprise par un humain",
      detail: "Dar Salah Eddine Oasis Pool & Spa — Booking",
      time: "il y a 1 h",
      go: () => navigate({ to: "/service-client", search: { est: "est-3", tab: "conversations" } }),
    },
    {
      label: "Nouvelle question sans réponse détectée",
      detail: "Dr Lazrek Villa & Guest House — FAQ",
      time: "il y a 1 h 20",
      go: () => navigate({ to: "/service-client", search: { est: "est-4", tab: "faq" } }),
    },
    {
      label: "Nouvel établissement ajouté",
      detail: "Ksar Tameslohte Retreat",
      time: "il y a 2 h",
      go: () => navigate({ to: "/service-client", search: { est: "est-10", tab: "infos" } }),
    },
    {
      label: "Réclamation marquée comme résolue",
      detail: "Palais des Collectionneurs — Facturation",
      time: "il y a 3 h",
      go: () => navigate({ to: "/reclamations", search: { statut: "Résolue" } }),
    },
  ];

  return (
    <PageShell
      eyebrow="AHA Control"
      title="Tableau de bord"
      subtitle="La performance de la relation voyageur de tous vos établissements, en un regard : volume de messages, autonomie de l'agent IA et urgences du jour."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((kpi, i) => (
          <motion.button
            key={kpi.label}
            type="button"
            onClick={kpi.onClick}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.3 }}
            className="glass lift rounded-2xl p-5 text-left"
          >
            <span className="bg-accent-soft text-primary-dark mb-4 grid h-9 w-9 place-items-center rounded-xl">
              <kpi.icon className="h-4 w-4" />
            </span>
            <p className="font-display text-primary-dark text-3xl">
              <CountUp value={kpi.value} suffix={kpi.suffix ?? ""} />
            </p>
            <p className="text-foreground mt-2 text-xs leading-snug font-medium">{kpi.label}</p>
            <p className="text-muted-foreground mt-1 text-[0.7rem]">{kpi.hint}</p>
          </motion.button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 lg:col-span-3"
        >
          <h2 className="font-display text-primary-dark text-xl">Volume de messages par établissement</h2>
          <p className="text-muted-foreground mb-4 text-xs">7 derniers jours, tous canaux</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ left: -18, right: 8, top: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                  interval={0}
                  angle={-28}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--card)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="messages" fill="var(--primary)" radius={[6, 6, 0, 0]} maxBarSize={34} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="glass rounded-2xl p-5 lg:col-span-2"
        >
          <h2 className="font-display text-primary-dark text-xl">Activité récente</h2>
          <p className="text-muted-foreground mb-4 text-xs">Cliquez une ligne pour ouvrir le dossier</p>
          <ul className="scroll-warm max-h-80 space-y-2 overflow-y-auto pr-1">
            {activity.map((a, i) => (
              <motion.li
                key={a.label + i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.04 }}
              >
                <button
                  type="button"
                  onClick={a.go}
                  className="border-border/60 hover:border-accent-glow hover:bg-accent-soft/40 w-full rounded-xl border p-3 text-left transition-colors"
                >
                  <p className="text-primary-dark text-xs font-medium">{a.label}</p>
                  <p className="text-muted-foreground mt-0.5 text-[0.7rem]">
                    {a.detail} · {a.time}
                  </p>
                </button>
              </motion.li>
            ))}
          </ul>
        </motion.section>
      </div>

      <AiAssistant />
    </PageShell>
  );
}
