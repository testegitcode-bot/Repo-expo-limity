"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBus,
  FaCamera,
  FaChartLine,
  FaCheck,
  FaCity,
  FaCoins,
  FaCompass,
  FaCrown,
  FaHeart,
  FaLandmark,
  FaLeaf,
  FaLocationDot,
  FaMedal,
  FaPaw,
  FaPersonHiking,
  FaPlane,
  FaTree,
  FaUmbrellaBeach,
  FaUtensils,
} from "react-icons/fa6";

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

const badges = [
  { title: "Primeira viagem", description: "Planejou sua primeira viagem", icon: <FaCompass /> },
  { title: "Caçador de ofertas", description: "Economizou em 3 roteiros", icon: <FaCoins /> },
  { title: "Viajante frequente", description: "Visitou 4 estados", icon: <FaCamera /> },
  { title: "Explorador", description: "Conheceu 6 destinos", icon: <FaMedal /> },
];

export default function Perfil() {
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([
    "Praia",
    "Natureza",
    "Urbano",
    "Avião",
    "Ônibus",
  ]);

  const togglePreference = (label: string) => {
    setSelectedPreferences((current) =>
      current.includes(label)
        ? current.filter((preference) => preference !== label)
        : [...current, label],
    );
  };

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
              MP
            </div>
            <button
              type="button"
              aria-label="Alterar foto de perfil"
              className="absolute -right-1 -bottom-1 flex items-center justify-center size-8 rounded-full bg-azul text-branco border-2 border-white cursor-pointer hover:bg-azul-claro transition"
            >
              <FaCamera className="size-3" />
            </button>
          </div>
          <p className="text-xl font-semibold text-azul">Marina Pereira</p>
          <p className="text-sm text-gray-500 mt-1">marina@email.com</p>
          <p className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
            <FaLocationDot className="text-azul-claro" /> Belo Horizonte - MG
          </p>
          <button
            type="button"
            className="w-full border-2 border-azul text-azul hover:bg-azul hover:text-branco transition rounded-xl py-2.5 mt-6 font-semibold cursor-pointer"
          >
            Editar perfil
          </button>
        </section>

        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="flex items-center justify-center size-9 rounded-xl bg-ciano text-azul"><FaCoins /></span>
                <span className="text-xs font-semibold text-green-700 bg-green-50 rounded-full px-2 py-1">+12%</span>
              </div>
              <p className="text-2xl font-bold text-azul">1.240</p>
              <p className="text-xs text-gray-400 mt-1">Pontos acumulados</p>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="flex items-center justify-center size-9 rounded-xl bg-amarelo/40 text-azul"><FaChartLine /></span>
                <span className="text-xs font-semibold text-azul bg-blue-50 rounded-full px-2 py-1">Disponível</span>
              </div>
              <p className="text-2xl font-bold text-azul">R$ 48,60</p>
              <p className="text-xs text-gray-400 mt-1">Cashback disponível</p>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="flex items-center justify-center size-9 rounded-xl bg-amarelo text-azul"><FaMedal /></span>
                <span className="text-xs font-semibold text-azul bg-ciano/50 rounded-full px-2 py-1">4 selos</span>
              </div>
              <p className="text-2xl font-bold text-azul">6</p>
              <p className="text-xs text-gray-400 mt-1">Conquistas desbloqueadas</p>
            </div>
          </section>

          <section className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
              <div>
                <p className="text-lg font-semibold text-azul">Nível do viajante</p>
                <p className="text-sm text-gray-500">Você está no nível Explorador.</p>
              </div>
              <span className="inline-flex items-center gap-2 w-fit bg-amarelo/50 text-azul text-sm font-bold rounded-full py-2 px-4">
                <FaCompass /> Nível 4
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>1.240 pontos</span>
              <span>1.500 para o próximo nível</span>
            </div>
            <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-[82%] rounded-full bg-azul-claro" />
            </div>
          </section>

          <section className="bg-azul rounded-2xl p-6 text-branco">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <FaCrown className="text-amarelo" />
                  <p className="text-lg font-semibold">Assinatura atual: Premium Plus</p>
                </div>
                <p className="text-gray-300 text-sm">Você está aproveitando recursos extras para planejar melhor.</p>
              </div>
              <span className="bg-ciano text-azul font-bold rounded-full py-2 px-4 text-sm whitespace-nowrap">Ativa</span>
            </div>
            <div className="grid grid-cols-3 gap-2 mt-5 text-center text-xs">
              <div className="rounded-xl border border-white/20 bg-white/10 py-3 text-ciano font-semibold">Padrão</div>
              <div className="rounded-xl bg-amarelo text-azul py-3 font-bold">Premium Plus</div>
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
            <div className="flex flex-wrap gap-3">
              {preferences.map(({ label, icon }) => {
                const isSelected = selectedPreferences.includes(label);
                return (
                  <button
                    key={label}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => togglePreference(label)}
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
              <span className="text-sm text-azul-claro font-semibold">4 de 8</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {badges.map(({ title, description, icon }) => (
                <div key={title} className="rounded-2xl bg-branco border border-gray-100 p-4 text-center hover:border-amarelo transition-colors">
                  <span className="mx-auto mb-3 flex items-center justify-center size-12 rounded-full bg-amarelo/60 text-azul text-xl">{icon}</span>
                  <p className="font-semibold text-azul text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
                </div>
              ))}
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
    </main>
  );
}
