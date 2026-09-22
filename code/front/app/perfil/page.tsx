"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBus,
  FaCamera,
  FaChartLine,
  FaCheck,
  FaChevronRight,
  FaCity,
  FaCoins,
  FaCompass,
  FaCrown,
  FaEnvelope,
  FaHeart,
  FaLandmark,
  FaLeaf,
  FaMedal,
  FaPaw,
  FaPersonHiking,
  FaPlane,
  FaTrash,
  FaTree,
  FaUmbrellaBeach,
  FaUser,
  FaUtensils,
  FaXmark,
} from "react-icons/fa6";
import { ApiError, deleteAccount, getCurrentUser, updatePreferences, updateProfile, type AuthUser } from "@/lib/api";
import {
  allBadgesForDisplay,
  BADGE_CATALOG,
  initialsFromName,
  pointsFromSpent,
  travelerLevel,
  unlockedBadges,
  type BadgeDefinition,
} from "@/lib/badges";
import { formatBRL } from "@/lib/format";
import { clearSessionToken, getSessionToken } from "@/lib/session";

interface Preference {
  label: string;
  icon: ReactNode;
}

const preferences: Preference[] = [
  { label: "Praia", icon: <FaUmbrellaBeach /> },
  { label: "Natureza", icon: <FaTree /> },
  { label: "Urbano", icon: <FaCity /> },
  { label: "Avião", icon: <FaPlane /> },
  { label: "Ônibus", icon: <FaBus /> },
  { label: "Pet friendly", icon: <FaPaw /> },
  { label: "Aventura", icon: <FaPersonHiking /> },
  { label: "Cultura", icon: <FaLandmark /> },
  { label: "Gastronomia", icon: <FaUtensils /> },
  { label: "Relaxar", icon: <FaLeaf /> },
];

const badgeIcons: Record<string, ReactNode> = {
  "primeira-viagem": <FaCompass />,
  "cinco-reais": <FaPlane />,
  "dez-reais": <FaMedal />,
  "quinze-reais": <FaPersonHiking />,
  "vinte-reais": <FaCamera />,
  "vinte-cinco": <FaBus />,
  "trinta-reais": <FaCrown />,
  "trinta-cinco": <FaHeart />,
};

const PREVIEW_SLOTS = 4;

export default function Perfil() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  useEffect(() => {
    if (!badgesOpen && !editOpen && !deleteOpen) {
      return;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setBadgesOpen(false);
        setEditOpen(false);
        setDeleteOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [badgesOpen, editOpen, deleteOpen]);

  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      router.replace("/entrar");
      return;
    }
    getCurrentUser(token)
      .then((current) => {
        setUser(current);
        setSelectedPreferences(current.preferences ?? []);
      })
      .catch(() => {
        clearSessionToken();
        router.replace("/entrar");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const points = pointsFromSpent(user?.spentAmount ?? 0);
  const cashback = 0;
  const unlocked = useMemo(() => unlockedBadges(points), [points]);
  const previewBadges = unlocked.slice(0, PREVIEW_SLOTS);
  const catalogForModal = useMemo(() => allBadgesForDisplay(points), [points]);
  const level = travelerLevel(points);
  const progress = Math.min(100, Math.round((points / level.nextAt) * 100));

  const openEdit = () => {
    if (!user) {
      return;
    }
    setEditName(user.name);
    setEditEmail(user.email);
    setError("");
    setEditOpen(true);
  };

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const token = getSessionToken();
    if (!token) {
      router.replace("/entrar");
      return;
    }
    setSavingProfile(true);
    setError("");
    try {
      const updated = await updateProfile(token, { name: editName.trim(), email: editEmail.trim() });
      setUser(updated);
      setEditOpen(false);
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Não foi possível atualizar o perfil.");
    } finally {
      setSavingProfile(false);
    }
  };

  const confirmDeleteAccount = async () => {
    const token = getSessionToken();
    if (!token) {
      router.replace("/entrar");
      return;
    }
    setDeletingAccount(true);
    setError("");
    try {
      await deleteAccount(token);
      clearSessionToken();
      router.replace("/");
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Não foi possível excluir a conta.");
      setDeletingAccount(false);
    }
  };

  const togglePreference = async (label: string) => {
    const token = getSessionToken();
    if (!token) {
      router.replace("/entrar");
      return;
    }
    const next = selectedPreferences.includes(label)
      ? selectedPreferences.filter((preference) => preference !== label)
      : [...selectedPreferences, label];
    const previous = selectedPreferences;
    setSelectedPreferences(next);
    setError("");
    try {
      const updated = await updatePreferences(token, next);
      setUser(updated);
      setSelectedPreferences(updated.preferences ?? next);
    } catch (requestError) {
      setSelectedPreferences(previous);
      setError(requestError instanceof ApiError ? requestError.message : "Não foi possível salvar as preferências.");
    }
  };

  if (loading || !user) {
    return (
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-gray-500">Carregando seu perfil...</p>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-azul font-semibold text-sm mb-10 hover:gap-3 transition-all"
      >
        <FaArrowLeft /> Voltar para o início
      </Link>

      <div className="mb-10">
        <p className="text-3xl sm:text-4xl font-semibold text-azul mb-2">Meu perfil</p>
        <p className="text-gray-500">Suas informações, progresso e preferências de viagem.</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
        <section className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="relative mx-auto w-fit mb-4">
            <div className="flex items-center justify-center size-24 rounded-full bg-azul-claro text-branco text-3xl font-bold border-4 border-amarelo">
              {initialsFromName(user.name)}
            </div>
            <button
              type="button"
              aria-label="Alterar foto de perfil"
              onClick={openEdit}
              className="absolute -right-1 -bottom-1 flex items-center justify-center size-8 rounded-full bg-azul text-branco border-2 border-white cursor-pointer hover:bg-azul-claro transition"
            >
              <FaCamera className="size-3" />
            </button>
          </div>
          <p className="text-xl font-semibold text-azul">{user.name}</p>
          <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          <button
            type="button"
            onClick={openEdit}
            className="w-full border-2 border-azul text-azul hover:bg-azul hover:text-branco transition rounded-xl py-2.5 mt-6 font-semibold cursor-pointer"
          >
            Editar perfil
          </button>
          <button
            type="button"
            onClick={() => {
              setError("");
              setDeleteOpen(true);
            }}
            className="w-full mt-3 inline-flex items-center justify-center gap-2 border-2 border-red-200 text-red-700 hover:bg-red-50 transition rounded-xl py-2.5 font-semibold cursor-pointer"
          >
            <FaTrash className="size-3" /> Excluir conta
          </button>
        </section>

        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="flex items-center justify-center size-9 rounded-xl bg-ciano text-azul">
                  <FaCoins />
                </span>
                <span className="text-xs font-semibold text-azul bg-blue-50 rounded-full px-2 py-1">1 pt = R$ 1</span>
              </div>
              <p className="text-2xl font-bold text-azul">{points.toLocaleString("pt-BR")}</p>
              <p className="text-xs text-gray-400 mt-1">Pontos acumulados</p>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="flex items-center justify-center size-9 rounded-xl bg-amarelo/40 text-azul">
                  <FaChartLine />
                </span>
                <span className="text-xs font-semibold text-gray-500 bg-gray-100 rounded-full px-2 py-1">Em breve</span>
              </div>
              <p className="text-2xl font-bold text-azul">{formatBRL(cashback)}</p>
              <p className="text-xs text-gray-400 mt-1">Cashback disponível</p>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="flex items-center justify-center size-9 rounded-xl bg-amarelo text-azul">
                  <FaMedal />
                </span>
                <span className="text-xs font-semibold text-azul bg-ciano/50 rounded-full px-2 py-1">
                  {unlocked.length} {unlocked.length === 1 ? "selo" : "selos"}
                </span>
              </div>
              <p className="text-2xl font-bold text-azul">{unlocked.length}</p>
              <p className="text-xs text-gray-400 mt-1">Conquistas desbloqueadas</p>
            </div>
          </section>

          <section className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-lg font-semibold text-azul">Nível do viajante</p>
                <p className="text-sm text-gray-500">Você está no nível {level.label}.</p>
              </div>
              <span className="inline-flex items-center gap-2 w-fit bg-amarelo/50 text-azul text-sm font-bold rounded-full py-2 px-4">
                <FaCompass /> Nível {level.level}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>{points.toLocaleString("pt-BR")} pontos</span>
              <span>{level.nextAt.toLocaleString("pt-BR")} para o próximo nível</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full rounded-full bg-azul-claro" style={{ width: `${progress}%` }} />
            </div>
          </section>

          <section className="bg-azul rounded-2xl p-6 text-branco">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaCrown className="text-amarelo" />
                  <p className="text-lg font-semibold">Assinatura atual: Padrão</p>
                </div>
                <p className="text-gray-300 text-sm">Recursos extras de assinatura ainda não estão ativos nesta conta.</p>
              </div>
              <span className="bg-white/15 text-branco font-bold rounded-full py-2 px-4 text-sm whitespace-nowrap">Grátis</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5 text-center text-xs">
              <div className="rounded-xl bg-amarelo text-azul py-3 font-bold">Padrão</div>
              <div className="rounded-xl border border-white/20 bg-white/10 py-3 text-gray-300 font-semibold">Premium Plus</div>
              <div className="rounded-xl border border-white/20 bg-white/10 py-3 text-gray-300 font-semibold">Premium Pro</div>
            </div>
          </section>

          <section className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-lg font-semibold text-azul">Preferências de viagem</p>
                <p className="text-sm text-gray-500">Selecione tudo que combina com você.</p>
              </div>
              <FaHeart className="text-amarelo size-5" />
            </div>
            {error && <p role="alert" className="text-sm text-red-600 mb-4">{error}</p>}
            <div className="flex flex-wrap gap-3">
              {preferences.map(({ label, icon }) => {
                const isSelected = selectedPreferences.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => void togglePreference(label)}
                    className={`flex items-center gap-2 text-sm font-semibold rounded-full py-2 px-4 border-2 cursor-pointer transition ${
                      isSelected
                        ? "bg-ciano border-ciano text-azul"
                        : "bg-white border-gray-200 text-gray-500 hover:border-azul-claro hover:text-azul"
                    }`}
                  >
                    {isSelected ? <FaCheck className="size-3" /> : icon}
                    {label}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-lg font-semibold text-azul">Meus selos</p>
                <p className="text-sm text-gray-500">Conquistas que você já desbloqueou.</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-azul-claro font-semibold">
                  {unlocked.length} de {BADGE_CATALOG.length}
                </span>
                <button
                  type="button"
                  onClick={() => setBadgesOpen(true)}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-azul cursor-pointer hover:underline"
                >
                  Ver todos <FaChevronRight className="size-3" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 h-64 lg:h-52">
              {previewBadges.length === 0 ? (
                <p className="col-span-2 lg:col-span-4 flex items-center justify-center text-sm text-gray-500 text-center px-6">
                  Você não possui selos desbloqueados ainda
                </p>
              ) : (
                Array.from({ length: PREVIEW_SLOTS }, (_, index) => {
                  const badge = previewBadges[index];
                  if (!badge) {
                    return <div key={`empty-${index}`} className="h-full" />;
                  }
                  return <BadgeCard key={badge.id} badge={badge} unlocked />;
                })
              )}
            </div>
          </section>

          <section className="bg-azul rounded-2xl p-6 text-branco flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-lg font-semibold mb-1">Continue planejando</p>
              <p className="text-gray-300 text-sm">Descubra onde seu próximo orçamento pode levar você.</p>
            </div>
            <Link href="/#buscar" className="bg-amarelo text-cinza font-semibold rounded-xl py-3 px-5 text-center whitespace-nowrap hover:brightness-95 transition inline-flex items-center justify-center gap-2">
              Nova busca <FaArrowRight />
            </Link>
          </section>
        </div>
      </div>

      {badgesOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="todos-selos"
          onClick={() => setBadgesOpen(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p id="todos-selos" className="text-lg font-semibold text-azul">Todos os selos</p>
                <p className="text-sm text-gray-500">Selos desbloqueados aparecem primeiro, com destaque.</p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setBadgesOpen(false)}
                className="size-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer text-azul"
              >
                <FaXmark />
              </button>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {catalogForModal.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} unlocked={points >= badge.threshold} />
              ))}
            </div>
          </div>
        </div>
      )}
      {editOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="editar-perfil"
          onClick={() => setEditOpen(false)}
        >
          <form
            className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
            onSubmit={saveProfile}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <p id="editar-perfil" className="text-lg font-semibold text-azul">Editar perfil</p>
                <p className="text-sm text-gray-500">Atualize o nome e o e-mail da sua conta.</p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setEditOpen(false)}
                className="size-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer text-azul"
              >
                <FaXmark />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label htmlFor="edit-name" className="font-semibold text-sm mb-1 block">Nome completo</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="edit-name"
                    value={editName}
                    onChange={(event) => setEditName(event.currentTarget.value)}
                    required
                    className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-4 focus:bg-blue-50"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="edit-email" className="font-semibold text-sm mb-1 block">E-mail</label>
                <div className="relative">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="edit-email"
                    type="email"
                    value={editEmail}
                    onChange={(event) => setEditEmail(event.currentTarget.value)}
                    required
                    className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-4 focus:bg-blue-50"
                  />
                </div>
              </div>
            </div>
            {error && <p role="alert" className="text-sm text-red-600 mt-4">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
                className="flex-1 border-2 border-gray-200 rounded-xl py-2.5 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingProfile}
                className="flex-1 bg-amarelo hover:brightness-95 rounded-xl py-2.5 font-semibold cursor-pointer"
              >
                {savingProfile ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="excluir-conta"
          onClick={() => setDeleteOpen(false)}
        >
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p id="excluir-conta" className="text-lg font-semibold text-azul">Excluir conta</p>
                <p className="text-sm text-gray-500 mt-1">
                  Esta ação apaga seu perfil, preferências e progresso. Não dá para desfazer.
                </p>
              </div>
              <button
                type="button"
                aria-label="Fechar"
                onClick={() => setDeleteOpen(false)}
                className="size-9 rounded-full hover:bg-gray-100 flex items-center justify-center cursor-pointer text-azul"
              >
                <FaXmark />
              </button>
            </div>
            {error && <p role="alert" className="text-sm text-red-600 mb-4">{error}</p>}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteOpen(false)}
                className="flex-1 border-2 border-gray-200 rounded-xl py-2.5 font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => void confirmDeleteAccount()}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-2.5 font-semibold cursor-pointer"
              >
                {deletingAccount ? "Excluindo..." : "Excluir definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BadgeCard({ badge, unlocked }: { badge: BadgeDefinition; unlocked: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-4 text-center h-full overflow-hidden ${
        unlocked
          ? "bg-amarelo/60 border-amarelo/40 text-azul"
          : "bg-gray-100 border-gray-100 text-gray-400"
      }`}
    >
      <span
        className={`mx-auto mb-3 flex items-center justify-center size-12 rounded-full text-xl ${
          unlocked ? "bg-amarelo text-azul" : "bg-gray-200 text-gray-400"
        }`}
      >
        {badgeIcons[badge.id]}
      </span>
      <p className={`font-semibold text-sm ${unlocked ? "text-azul" : "text-gray-400"}`}>{badge.title}</p>
      <p className={`text-xs mt-1 leading-relaxed ${unlocked ? "text-azul/80" : "text-gray-400"}`}>{badge.description}</p>
    </div>
  );
}
