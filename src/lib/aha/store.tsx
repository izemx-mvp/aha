import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import {
  COMPLAINTS,
  CONVERSATIONS,
  DOCS,
  ESTABLISHMENTS,
  FAQS,
  SERVICES,
  UNANSWERED,
  type Category,
  type Complaint,
  type ComplaintStatus,
  type Conversation,
  type Doc,
  type Establishment,
  type FaqItem,
  type Service,
  type Unanswered,
  type Urgency,
} from "./data";

let counter = 0;
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${++counter}`;

type Store = {
  establishments: Establishment[];
  conversations: Conversation[];
  faqs: FaqItem[];
  unanswered: Unanswered[];
  docs: Doc[];
  services: Service[];
  complaints: Complaint[];
  addEstablishment: (e: Omit<Establishment, "id">) => Establishment;
  updateEstablishment: (id: string, patch: Partial<Establishment>) => void;
  answerConversation: (convId: string, text: string) => void;
  addFaq: (f: Omit<FaqItem, "id">) => void;
  updateFaq: (id: string, patch: Partial<FaqItem>) => void;
  deleteFaq: (id: string) => void;
  removeUnanswered: (id: string) => void;
  addDoc: (d: Omit<Doc, "id">) => void;
  deleteDoc: (id: string) => void;
  addService: (s: Omit<Service, "id">) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  deleteService: (id: string) => void;
  createComplaint: (input: {
    estId: string;
    client: string;
    channel: Complaint["channel"];
    category: Category;
    urgency: Urgency;
    message: string;
    conversationId?: string | undefined;
  }) => Complaint;
  setComplaintStatus: (id: string, status: ComplaintStatus) => void;
  setComplaintNotes: (id: string, notes: string) => void;
};

const Ctx = createContext<Store | null>(null);

export function AhaProvider({ children }: { children: ReactNode }) {
  const [establishments, setEstablishments] = useState<Establishment[]>(ESTABLISHMENTS);
  const [conversations, setConversations] = useState<Conversation[]>(CONVERSATIONS);
  const [faqs, setFaqs] = useState<FaqItem[]>(FAQS);
  const [unanswered, setUnanswered] = useState<Unanswered[]>(UNANSWERED);
  const [docs, setDocs] = useState<Doc[]>(DOCS);
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [complaints, setComplaints] = useState<Complaint[]>(COMPLAINTS);

  const value = useMemo<Store>(() => {
    return {
      establishments,
      conversations,
      faqs,
      unanswered,
      docs,
      services,
      complaints,
      addEstablishment: (e) => {
        const created: Establishment = { ...e, id: uid("est"), isNew: true };
        setEstablishments((prev) => [...prev, created]);
        setTimeout(() => {
          setEstablishments((prev) =>
            prev.map((x) => (x.id === created.id ? { ...x, isNew: false } : x)),
          );
        }, 12000);
        return created;
      },
      updateEstablishment: (id, patch) =>
        setEstablishments((prev) => prev.map((e) => (e.id === id ? { ...e, ...patch } : e))),
      answerConversation: (convId, text) =>
        setConversations((prev) =>
          prev.map((c) =>
            c.id === convId
              ? {
                  ...c,
                  status: "Clôturé",
                  preview: text,
                  messages: [
                    ...c.messages,
                    { id: uid("m"), from: "human", text, at: new Date().toISOString() },
                  ],
                }
              : c,
          ),
        ),
      addFaq: (f) => setFaqs((prev) => [{ ...f, id: uid("faq") }, ...prev]),
      updateFaq: (id, patch) => setFaqs((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f))),
      deleteFaq: (id) => setFaqs((prev) => prev.filter((f) => f.id !== id)),
      removeUnanswered: (id) => setUnanswered((prev) => prev.filter((u) => u.id !== id)),
      addDoc: (d) => setDocs((prev) => [{ ...d, id: uid("doc") }, ...prev]),
      deleteDoc: (id) => setDocs((prev) => prev.filter((d) => d.id !== id)),
      addService: (s) => setServices((prev) => [...prev, { ...s, id: uid("srv") }]),
      updateService: (id, patch) =>
        setServices((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s))),
      deleteService: (id) => setServices((prev) => prev.filter((s) => s.id !== id)),
      createComplaint: (input) => {
        const now = new Date().toISOString();
        const created: Complaint = {
          id: uid("rec"),
          estId: input.estId,
          client: input.client,
          channel: input.channel,
          category: input.category,
          urgency: input.urgency,
          status: "Nouvelle",
          createdAt: now,
          message: input.message,
          notes: "",
          conversationId: input.conversationId,
          history: [{ at: now, label: "Réclamation créée depuis une conversation" }],
        };
        setComplaints((prev) => [created, ...prev]);
        return created;
      },
      setComplaintStatus: (id, status) =>
        setComplaints((prev) =>
          prev.map((c) =>
            c.id === id
              ? {
                  ...c,
                  status,
                  history: [
                    ...c.history,
                    { at: new Date().toISOString(), label: `Statut modifié : ${status}` },
                  ],
                }
              : c,
          ),
        ),
      setComplaintNotes: (id, notes) =>
        setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, notes } : c))),
    };
  }, [establishments, conversations, faqs, unanswered, docs, services, complaints]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAha() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAha must be used inside AhaProvider");
  return ctx;
}
