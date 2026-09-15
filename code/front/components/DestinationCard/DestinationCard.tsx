import Image from "next/image";
import { ReactNode } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";

export interface Destination {
  id: string;
  name: string;
  state: string;
  categoryLabel: string;
  categoryIcon: ReactNode;
  image: string;
  description: string;
  priceFrom: number;
  days: string;
}

interface props {
  destination: Destination;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
}: props) {
  const { id, name, state, categoryLabel, categoryIcon, image, description, priceFrom, days } =
    destination;

  return (
    <div className="flex flex-col bg-white border-2 border-gray-100 rounded-2xl overflow-hidden h-full transition hover:shadow-lg hover:-translate-y-1">
      <div className="relative w-full aspect-4/3">
        <Image
          src={image}
          alt={`Vista de ${name}, ${state}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover"
        />
        <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 text-azul text-xs font-semibold rounded-full py-1.5 px-3">
          {categoryIcon}
          {categoryLabel}
        </span>
        <button
          type="button"
          aria-label={
            isFavorite ? `Remover ${name} dos favoritos` : `Salvar ${name} nos favoritos`
          }
          aria-pressed={isFavorite}
          onClick={() => onToggleFavorite(id)}
          className="absolute top-3 right-3 cursor-pointer bg-white/90 rounded-full size-9 flex items-center justify-center text-amarelo hover:bg-white transition"
        >
          {isFavorite ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="font-semibold text-azul text-lg">{name}</span>
          <span className="text-gray-400 text-xs whitespace-nowrap">{state}</span>
        </div>
        <p className="text-gray-500 text-sm flex-1 leading-relaxed mb-4">
          {description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t-2 border-gray-100">
          <div>
            <p className="text-xs text-gray-400">A partir de</p>
            <p className="font-bold text-azul">
              R$ {priceFrom.toLocaleString("pt-BR")}
            </p>
          </div>
          <span className="text-xs text-gray-400">{days}</span>
        </div>
      </div>
    </div>
  );
}
