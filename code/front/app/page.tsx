"use client";

import { useState } from "react";
import Link from "next/link";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import RatingsCard from "@/components/RatingsCard/RatingsCard";
import SearchWidget from "@/components/SearchWidget/SearchWidget";
import StepCard from "@/components/StepCard/StepCard";
import {
  getCategory,
  rawDestinations,
  type RawDestination,
} from "@/lib/destinations";
import {
  FaArrowRight,
  FaClock,
  FaPlane,
  FaRobot,
  FaShieldHalved,
  FaSliders,
  FaWallet,
} from "react-icons/fa6";

const featuredIds = ["rio-de-janeiro", "bonito", "gramado", "maldivas"];
const featuredDestinations = featuredIds
  .map((id) => rawDestinations.find((destination) => destination.id === id))
  .filter((destination): destination is RawDestination => destination !== undefined);

const testimonials = [
  {
    rating: 5,
    title: "Viajei com R$ 420 e ainda sobrou dinheiro",
    name: "Rafa M.",
  },
  {
    rating: 5,
    title: "Economizei horas que gastaria comparando site por site",
    name: "Marina T.",
  },
  {
    rating: 4,
    title: "Achei um destino que nem tinha pensado, dentro do orçamento",
    name: "Lucas D.",
  },
];

export default function Home() {
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  };

  return (
    <>
      {/* Hero */}
      <div
        id="buscar"
        className="relative flex flex-col w-full bg-azul justify-center overflow-hidden py-16 sm:py-20 px-4"
      >
        <div className="absolute -top-28 -left-20 size-72 rounded-full bg-azul-claro/20 blur-2xl" />
        <div className="absolute -bottom-32 -right-16 size-80 rounded-full bg-ciano/10 blur-2xl" />

        <div className="relative">
          <span className="flex items-center gap-2 w-fit mx-auto bg-white/10 border border-white/20 text-branco text-xs font-semibold rounded-full py-1.5 px-4 mb-6">
            <FaClock className="text-amarelo" />
            Roteiro pronto em até 10 segundos
          </span>

          <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-branco pb-6 leading-snug">
            Não escolha o destino,
            <br />
            escolha <span className="text-amarelo">quanto você pode gastar</span>.
          </p>
          <p className="text-gray-400 text-center pb-8 leading-relaxed max-w-xl mx-auto">
            O Limity calcula destino, dias, transporte e hospedagem que cabem
            <br className="hidden sm:block" />
            exatamente no seu orçamento.
          </p>
          <div className="w-full flex justify-center">
            <div className="w-full max-w-190 drop-shadow-2xl">
              <SearchWidget />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <FaSliders className="text-ciano" />
              Praia, cidade, natureza ou serra
            </span>
            <span className="flex items-center gap-2">
              <FaPlane className="text-ciano" />
              Ônibus e avião comparados juntos
            </span>
            <span className="flex items-center gap-2">
              <FaShieldHalved className="text-ciano" />
              Sem estourar o cartão
            </span>
          </div>
        </div>
      </div>

      {/* Como funciona */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <p className="text-2xl font-semibold text-azul text-center mb-3">
          Do orçamento à viagem, em 3 passos
        </p>
        <p className="text-gray-500 text-center mb-12">
          Você não precisa saber pra onde ir. A gente descobre com você.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-10 mb-10">
          <StepCard
            number={1}
            icon={<FaWallet className="size-6" />}
            title="Diga o valor"
            description="Informe quanto você pode gastar no total ou por pessoa, sua origem e suas preferências de viagem."
          />
          <StepCard
            number={2}
            icon={<FaRobot className="size-6" />}
            title="Nós calculamos"
            description="Testamos milhares de combinações de transporte, hospedagem e dias em diferentes fontes de preço."
          />
          <StepCard
            number={3}
            icon={<FaPlane className="size-6" />}
            title="Você viaja"
            description="Roteiro completo com custo total detalhado, sem surpresa nenhuma no final."
          />
        </div>
        <div className="flex justify-center">
          <Link
            href="/como-funciona"
            className="text-azul font-semibold flex items-center gap-2 hover:gap-3 transition-all"
          >
            Ver como funciona em detalhes <FaArrowRight />
          </Link>
        </div>
      </div>

      {/* Destinos em destaque */}
      <div className="bg-white py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-2xl font-semibold text-azul text-center mb-3">
            Alguns lugares que cabem no seu orçamento
          </p>
          <p className="text-gray-500 text-center mb-12">
            Uma pequena amostra do que o Limity considera na hora de montar o
            seu roteiro.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
            {featuredDestinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={{
                  ...destination,
                  categoryLabel: getCategory(destination.category).label,
                  categoryIcon: getCategory(destination.category).icon,
                }}
                isFavorite={favorites.includes(destination.id)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Link
              href="/destinos"
              className="text-azul font-semibold flex items-center gap-2 hover:gap-3 transition-all"
            >
              Ver todos os destinos <FaArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Prova social */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <p className="text-2xl font-semibold text-azul text-center mb-12">
          Quem já viajou com o Limity
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <RatingsCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-azul py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-branco mb-4">
            Só falta você dizer o valor
          </p>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Volte pro topo e descubra em segundos onde essa grana leva você.
          </p>
          <a
            href="#buscar"
            className="bg-amarelo inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold cursor-pointer"
          >
            Simular minha viagem <FaArrowRight />
          </a>
        </div>
      </div>
    </>
  );
}
