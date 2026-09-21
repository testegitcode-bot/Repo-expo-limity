import Image from "next/image";
import {
  FaArrowUpRightFromSquare,
  FaBed,
  FaBus,
  FaCalendarDays,
  FaPlane,
  FaStar,
} from "react-icons/fa6";
import type { TripOption } from "@/lib/api";
import { formatBRL, formatDay, formatTime } from "@/lib/format";

interface props {
  option: TripOption;
}

export default function TripCard({ option }: props) {
  const { destination, transport, flight, bus, hotel } = option;
  const isFlight = transport === "AVIAO";

  return (
    <div className="flex flex-col bg-white border-2 border-gray-100 rounded-2xl overflow-hidden h-full transition hover:shadow-lg">
      <div className="relative w-full aspect-4/3 bg-azul/10">
        {destination.image && (
          <Image
            src={destination.image.url}
            alt={`Vista de ${destination.name}, ${destination.state}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        )}
        <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/90 text-azul text-xs font-semibold rounded-full py-1.5 px-3">
          {isFlight ? <FaPlane /> : <FaBus />}
          {isFlight ? "Avião" : "Ônibus"}
        </span>
        {destination.image?.photographer && (
          <span className="absolute bottom-2 right-2 bg-black/55 text-white text-[10px] rounded px-1.5 py-0.5">
            Foto:{" "}
            <a
              href={destination.image.photographerUrl ?? destination.image.sourceUrl ?? "https://www.pexels.com"}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {destination.image.photographer}
            </a>{" "}
            /{" "}
            <a
              href="https://www.pexels.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Pexels
            </a>
          </span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <span className="font-semibold text-azul text-lg">{destination.name}</span>
          <span className="text-gray-400 text-xs whitespace-nowrap">{destination.state}</span>
        </div>
        <p className="flex items-center gap-2 text-gray-500 text-sm mb-4">
          <FaCalendarDays className="shrink-0" />
          {formatDay(option.checkIn)} a {formatDay(option.checkOut)} · {option.nights}{" "}
          {option.nights === 1 ? "noite" : "noites"}
        </p>

        <div className="flex flex-col gap-4 flex-1 text-sm">
          {/* Transporte */}
          <div className="flex justify-between gap-3">
            <div className="text-gray-600">
              {flight && (
                <>
                  <p className="font-semibold text-azul">
                    Voo {flight.airline} {flight.flightNumber}
                    {" · "}
                    {flight.transfers === 0
                      ? "direto"
                      : `${flight.transfers ?? "?"} escala${flight.transfers === 1 ? "" : "s"}`}
                  </p>
                  <p>
                    Ida {formatDay(flight.departureAt)} {formatTime(flight.departureAt)} · volta{" "}
                    {formatDay(flight.returnAt)} {formatTime(flight.returnAt)}
                  </p>
                  {destination.flightTo && (
                    <p className="text-xs text-gray-400">
                      O voo pousa em {destination.flightTo}
                    </p>
                  )}
                  {flight.dateMatch === "NEAR" && (
                    <p className="text-xs text-gray-400">
                      Data mais próxima da sua com preço encontrado
                    </p>
                  )}
                </>
              )}
              {bus && (
                <>
                  <p className="font-semibold text-azul">Ônibus (valor estimado)</p>
                  <p>
                    ~{Math.round(bus.distanceKm)} km · ~{bus.hours.toLocaleString("pt-BR")} h de viagem
                  </p>
                </>
              )}
            </div>
            <span className="font-semibold text-azul whitespace-nowrap">
              {formatBRL(option.transportCost)}
            </span>
          </div>

          {/* Hotel */}
          {hotel ? (
            <div className="flex justify-between gap-3">
              <div className="text-gray-600 min-w-0">
                <p className="flex items-center gap-2 font-semibold text-azul">
                  <FaBed className="shrink-0" />
                  <span className="truncate">{hotel.name}</span>
                </p>
                <p className="flex items-center gap-1">
                  {hotel.stars ? (
                    <span className="flex text-amarelo">
                      {Array.from({ length: Math.round(hotel.stars) }, (_, index) => (
                        <FaStar key={index} className="size-3" />
                      ))}
                    </span>
                  ) : null}
                  {hotel.rating ? <span>nota {hotel.rating.toLocaleString("pt-BR")}</span> : null}
                </p>
                <p className="text-xs text-gray-400">
                  {formatBRL(hotel.pricePerNight)} por noite
                </p>
              </div>
              <span className="font-semibold text-azul whitespace-nowrap">
                {formatBRL(option.hotelCost ?? hotel.total)}
              </span>
            </div>
          ) : (
            <p className="text-xs text-gray-400 bg-gray-50 rounded-lg p-3">
              Hotel não cotado para essas datas. O valor abaixo considera só o transporte.
            </p>
          )}
        </div>

        <div className="pt-4 mt-4 border-t-2 border-gray-100 flex items-end justify-between gap-3">
          <div>
            <p className="text-xs text-gray-400">{option.complete ? "Total da viagem" : "Só transporte"}</p>
            <p className="font-bold text-azul text-xl">{formatBRL(option.totalCost)}</p>
            <p className="text-xs text-green-700">
              Sobram {formatBRL(option.budgetLeft)}
            </p>
          </div>
          {flight?.bookingUrl && (
            <a
              href={flight.bookingUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="bg-amarelo text-sm font-semibold rounded-xl py-2 px-4 flex items-center gap-2 whitespace-nowrap"
            >
              Ver passagem <FaArrowUpRightFromSquare className="size-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
