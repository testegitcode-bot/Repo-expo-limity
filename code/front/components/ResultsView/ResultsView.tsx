"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaCircleExclamation,
  FaLocationDot,
  FaSpinner,
  FaTriangleExclamation,
} from "react-icons/fa6";
import TripCard from "@/components/TripCard/TripCard";
import { ApiError, searchTrips, type SearchPayload, type SearchResponse } from "@/lib/api";
import { formatBRL, formatDay } from "@/lib/format";

type State =
  | { status: "loading" }
  | { status: "done"; data: SearchResponse }
  | { status: "error"; message: string };

type Sort = "best" | "price";

function parsePayload(query: string): SearchPayload | null {
  const params = new URLSearchParams(query);
  const budget = Number(params.get("budget"));
  const origin = params.get("origin");
  const departureDate = params.get("date");
  if (!(budget > 0) || !origin || !departureDate) {
    return null;
  }
  return {
    budget,
    origin,
    departureDate,
    preferences: params.get("prefs")?.split(",").filter(Boolean) ?? [],
    sort: params.get("sort") === "price" ? "price" : "best",
  };
}

export default function ResultsView() {
  const searchParams = useSearchParams();
  const query = searchParams?.toString() ?? ""; // null só ocorre com a pasta /pages presente
  // A key recria o conteúdo a cada busca nova, voltando o estado para "carregando".
  return <ResultsContent key={query} query={query} />;
}

function ResultsContent({ query }: { query: string }) {
  const router = useRouter();
  const payload = useMemo(() => parsePayload(query), [query]);
  const [state, setState] = useState<State>(
    payload
      ? { status: "loading" }
      : { status: "error", message: "Faltam dados da busca. Volte e preencha o formulário." },
  );

  useEffect(() => {
    if (!payload) {
      return;
    }
    const controller = new AbortController();
    searchTrips(payload, controller.signal)
      .then((data) => setState({ status: "done", data }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) {
          return;
        }
        setState({
          status: "error",
          message:
            error instanceof ApiError
              ? error.message
              : "Algo deu errado ao buscar as opções. Tente novamente.",
        });
      });
    return () => controller.abort();
  }, [payload]);

  const changeSort = (sort: Sort) => {
    const params = new URLSearchParams(query);
    params.set("sort", sort);
    router.replace(`/resultados?${params.toString()}`);
  };

  const sort: Sort = payload?.sort ?? "best";

  return (
    <>
      <div className="w-full bg-azul py-12 sm:py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/#buscar"
            className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white mb-5"
          >
            <FaArrowLeft /> Nova busca
          </Link>
          <p className="text-3xl sm:text-4xl font-semibold text-branco leading-snug">
            {payload ? (
              <>
                Viagens para até <span className="text-amarelo">{formatBRL(payload.budget)}</span>
              </>
            ) : (
              "Resultados"
            )}
          </p>
          {payload && (
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-sm text-gray-300">
              <span className="flex items-center gap-2">
                <FaLocationDot className="text-ciano" />
                Saindo de {payload.origin}
              </span>
              <span>Ida em {formatDay(payload.departureDate)}</span>
              {payload.preferences.length > 0 && <span>{payload.preferences.join(" · ")}</span>}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {state.status === "loading" && (
          <div className="flex flex-col items-center text-center py-20 text-gray-500">
            <FaSpinner className="size-8 text-azul animate-spin mb-5" />
            <p className="font-semibold text-azul mb-1">
              Procurando as melhores opções para o seu orçamento...
            </p>
            <p className="text-sm">
              Estamos consultando voos e hotéis. Na primeira busca isso pode levar até um minuto.
            </p>
          </div>
        )}

        {state.status === "error" && (
          <div className="flex flex-col items-center text-center py-20">
            <FaCircleExclamation className="size-8 text-red-500 mb-4" />
            <p className="text-gray-600 max-w-md mb-6">{state.message}</p>
            <Link
              href="/#buscar"
              className="bg-amarelo inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold"
            >
              Voltar e tentar de novo
            </Link>
          </div>
        )}

        {state.status === "done" && (
          <Results data={state.data} sort={sort} onSortChange={changeSort} />
        )}
      </div>
    </>
  );
}

function Results({
  data,
  sort,
  onSortChange,
}: {
  data: SearchResponse;
  sort: Sort;
  onSortChange: (sort: Sort) => void;
}) {
  const sortOptions: { key: Sort; label: string }[] = [
    { key: "best", label: "Melhor hotel" },
    { key: "price", label: "Menor preço" },
  ];

  return (
    <>
      {data.warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-sm text-amber-900">
          <p className="flex items-center gap-2 font-semibold mb-2">
            <FaTriangleExclamation /> Avisos sobre esta busca
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {data.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {data.options.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-semibold text-azul mb-2">
            Nenhuma opção coube no orçamento para essa busca.
          </p>
          <p className="text-gray-500 mb-6">
            Tente aumentar o valor, mudar a data ou tirar algumas preferências.
          </p>
          <Link
            href="/#buscar"
            className="bg-amarelo inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold"
          >
            Fazer outra busca
          </Link>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <p className="text-gray-600">
              {data.totalFound} {data.totalFound === 1 ? "opção encontrada" : "opções encontradas"}
              {data.totalFound > data.options.length && ` (mostrando ${data.options.length})`}
            </p>
            <div className="flex gap-2">
              {sortOptions.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={sort === key}
                  onClick={() => onSortChange(key)}
                  className={`${
                    sort === key
                      ? "bg-ciano border-2 border-ciano font-semibold"
                      : "border-2 border-gray-300"
                  } cursor-pointer rounded-full py-1.5 px-4 text-sm`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-10">
            {data.options.map((option) => (
              <TripCard
                key={`${option.destination.id}-${option.transport}-${option.checkIn}`}
                option={option}
              />
            ))}
          </div>
        </>
      )}

      <p className="text-xs text-gray-400 text-center italic max-w-2xl mx-auto">
        Preços de voo vêm de buscas recentes de outros usuários e podem ter mudado; confirme no site
        de compra. Valores de ônibus são estimativas. Os hotéis exibidos, por enquanto, são dados de
        teste da nossa fonte de hospedagem.
      </p>
    </>
  );
}
