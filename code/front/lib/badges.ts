export interface BadgeDefinition {
  id: string;
  title: string;
  description: string;
  threshold: number;
}

export const BADGE_CATALOG: BadgeDefinition[] = [
  { id: "primeira-viagem", title: "Primeira viagem", description: "Acumulou 1 ponto em reservas", threshold: 1 },
  { id: "cinco-reais", title: "Embarque feito", description: "Gastou R$ 5 em viagens", threshold: 5 },
  { id: "dez-reais", title: "Viajante frequente", description: "Gastou R$ 10 em viagens", threshold: 10 },
  { id: "quinze-reais", title: "Explorador", description: "Gastou R$ 15 em viagens", threshold: 15 },
  { id: "vinte-reais", title: "Colecionador", description: "Gastou R$ 20 em viagens", threshold: 20 },
  { id: "vinte-cinco", title: "Mochileiro", description: "Gastou R$ 25 em viagens", threshold: 25 },
  { id: "trinta-reais", title: "Mestre das rotas", description: "Gastou R$ 30 em viagens", threshold: 30 },
  { id: "trinta-cinco", title: "Lenda Limity", description: "Gastou R$ 35 em viagens", threshold: 35 },
];

export function pointsFromSpent(spentAmount: number): number {
  if (!Number.isFinite(spentAmount) || spentAmount <= 0) {
    return 0;
  }
  return Math.floor(spentAmount);
}

export function unlockedBadges(points: number): BadgeDefinition[] {
  return BADGE_CATALOG.filter((badge) => points >= badge.threshold).sort(
    (left, right) => right.threshold - left.threshold,
  );
}

export function allBadgesForDisplay(points: number): BadgeDefinition[] {
  const unlocked = unlockedBadges(points);
  const locked = BADGE_CATALOG.filter((badge) => points < badge.threshold);
  return [...unlocked, ...locked];
}

export function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.trim().slice(0, 2).toUpperCase() || "LY";
}

export function travelerLevel(points: number): { level: number; label: string; nextAt: number } {
  const level = Math.max(1, Math.floor(points / 5) + 1);
  return {
    level,
    label: level <= 1 ? "Iniciante" : level <= 3 ? "Explorador" : "Viajante",
    nextAt: level * 5,
  };
}
