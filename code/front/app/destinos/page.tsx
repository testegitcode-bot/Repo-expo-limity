"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DestinationCard from "@/components/DestinationCard/DestinationCard";
import { categories, rawDestinations, type CategoryKey } from "@/lib/destinations";
import { FaArrowRight, FaMagnifyingGlass } from "react-icons/fa6";

export default function Destinos() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | "todos">(
    "todos",
  );
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favoriteId) => favoriteId !== id)
        : [...current, id],
    );
  };

  const filteredDestinations = useMemo(() => {
    return rawDestinations
      .filter((destination) =>
        activeCategory === "todos" ? true : destination.category === activeCategory,
      )
      .filter((destination) =>
        `${destination.name} ${destination.state}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      );
  }, [activeCategory, search]);

  return (
    <>
      <div className="flex flex-col w-full bg-azul justify-center py-16 sm:py-20 px-4">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-branco pb-6 leading-snug">
          Destinos para todo bolso
        </p>
        <p className="text-gray-400 text-center leading-relaxed max-w-2xl mx-auto">
          Uma amostra dos lugares que o Limity considera na hora de montar o
          seu roteiro. Folheie, favorite e se inspire antes de informar o seu
          orçamento.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 sm:mt-16">
        {/* Busca */}
        <div className="relative max-w-md mx-auto mb-8">
          <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.currentTarget.value)}
            placeholder="Buscar por destino ou estado"
            className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-4 focus:bg-blue-50"
          />
        </div>

        {/* Filtros de categoria */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <button
            type="button"
            onClick={() => setActiveCategory("todos")}
            className={`${
              activeCategory === "todos"
                ? "bg-ciano border-2 border-ciano font-semibold"
                : "border-2 border-gray-300"
            } cursor-pointer rounded-full py-2 px-5`}
          >
            Todos
          </button>
          {categories.map(({ key, label, icon }) => (
            <button
              key={key}
              type="button"
              aria-pressed={activeCategory === key}
              onClick={() => setActiveCategory(key)}
              className={`${
                activeCategory === key
                  ? "bg-ciano border-2 border-ciano font-semibold"
                  : "border-2 border-gray-300"
              } cursor-pointer rounded-full flex items-center gap-2 py-2 px-5`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        {/* Grid de destinos */}
        {filteredDestinations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-6">
            {filteredDestinations.map((destination) => {
              const category = categories.find(
                (item) => item.key === destination.category,
              )!;
              return (
                <DestinationCard
                  key={destination.id}
                  destination={{
                    ...destination,
                    categoryLabel: category.label,
                    categoryIcon: category.icon,
                  }}
                  isFavorite={favorites.includes(destination.id)}
                  onToggleFavorite={toggleFavorite}
                />
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-16">
            Nenhum destino encontrado com esse filtro. Tente outra busca.
          </p>
        )}

        <p className="text-xs text-gray-400 text-center italic max-w-xl mx-auto mb-16">
          Fotos meramente ilustrativas. Os destinos, preços e durações
          exibidos aqui são exemplos — o roteiro final é sempre calculado com
          base no orçamento e nas datas que você informar.
        </p>
      </div>

      {/* CTA final */}
      <div className="bg-azul py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-branco mb-4">
            Encontrou um destino de olho?
          </p>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Informe o seu orçamento e deixe o Limity verificar se ele cabe no
            seu bolso agora.
          </p>
          <Link
            href="/"
            className="bg-amarelo inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold cursor-pointer"
          >
            Simular minha viagem <FaArrowRight />
          </Link>
        </div>
      </div>
    </>
  );
}
