"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaCalendarDays,
  FaCheck,
  FaCircle,
  FaCircleExclamation,
  FaLocationDot,
  FaSpinner,
  FaTriangleExclamation,
  FaWallet,
} from "react-icons/fa6";
import TripCard from "@/components/TripCard/TripCard";
import { ApiError, searchTrips, type SearchPayload, type SearchResponse } from "@/lib/api";
import { formatBRL, formatDay } from "@/lib/format";

type State =
  | { status: "loading" }
  | { status: "done"; data: SearchResponse }
  | { status: "error"; message: string };

type Sort = "best" | "price";

type LoadingStep = {
  label: string;
  detail: string;
};

const loadingSteps: LoadingStep[] = [
  { label: "Analisando orçamento", detail: "Entendendo o que cabe no seu limite" },
  { label: "Consultando voos e ônibus", detail: "Comparando opções de transporte" },
  { label: "Consultando hospedagens", detail: "Buscando estadias para suas datas" },
  { label: "Gerando recomendações", detail: "Cruzando destinos e custos" },
  { label: "Selecionando melhores opções", detail: "Ordenando as viagens mais vantajosas" },
];

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
  const [loadingProgress, setLoadingProgress] = useState(8);

  useEffect(() => {
    if (state.status !== "loading") {
      return;
    }
    const interval = window.setInterval(() => {
      setLoadingProgress((current) => Math.min(current + Math.ceil((92 - current) / 14), 92));
    }, 500);
    return () => window.clearInterval(interval);
  }, [state.status]);

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
        {state.status === "loading" && payload && (
          <LoadingView payload={payload} progress={loadingProgress} />
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

function LoadingView({
  payload,
  progress,
}: {
  payload: SearchPayload;
  progress: number;
}) {
  const completedSteps = Math.min(loadingSteps.length - 1, Math.floor(progress / 20));
  const currentStep = Math.min(loadingSteps.length - 1, completedSteps);
  const message = loadingSteps[currentStep].detail;

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center py-8 text-center sm:py-14">
      <div className="mb-7 flex items-center gap-3 text-azul-claro" aria-hidden="true">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-ciano/50">
          <FaSpinner className="size-5 animate-spin" />
        </span>
        <span className="h-px w-10 bg-azul-claro/30 sm:w-16" />
        <span className="flex size-11 items-center justify-center rounded-2xl border-2 border-azul-claro/30 text-azul-claro">
          <FaLocationDot className="size-5" />
        </span>
      </div>

      <p className="mb-3 text-2xl font-semibold leading-snug text-azul sm:text-3xl">
        Encontrando as melhores viagens para você
      </p>
      <p className="max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
        Estamos analisando seu orçamento e comparando opções de transporte, hospedagem e destinos
        para encontrar as melhores recomendações.
      </p>

      <div className="mt-9 w-full text-left">
        <div className="mb-2 flex items-center justify-between gap-4 text-xs font-semibold text-gray-500">
          <span>{message}</span>
          <span className="text-azul">{progress}%</span>
        </div>
        <div
          className="h-3 overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-label="Progresso da busca"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-azul-claro transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-8 grid w-full grid-cols-1 overflow-hidden rounded-2xl border-2 border-gray-100 bg-white text-left shadow-sm">
        {loadingSteps.map((step, index) => {
          const isComplete = index < completedSteps;
          const isCurrent = index === currentStep;
          return (
            <div
              key={step.label}
              className={`flex items-start gap-3 border-b border-gray-100 p-4 last:border-b-0 sm:px-5 ${
                isCurrent ? "bg-ciano/20" : ""
              }`}
            >
              <span
                className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs ${
                  isComplete
                    ? "bg-green-100 text-green-700"
                    : isCurrent
                      ? "bg-azul text-branco"
                      : "bg-gray-100 text-gray-400"
                }`}
              >
                {isComplete ? <FaCheck /> : isCurrent ? <FaSpinner className="animate-spin" /> : <FaCircle className="size-2" />}
              </span>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${isComplete ? "text-green-700" : isCurrent ? "text-azul" : "text-gray-400"}`}>
                  {step.label}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid w-full grid-cols-1 gap-3 text-left sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
          <FaWallet className="text-azul-claro" />
          <div><p className="text-[11px] text-gray-400">Orçamento</p><p className="text-sm font-semibold text-azul">{formatBRL(payload.budget)}</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
          <FaLocationDot className="text-azul-claro" />
          <div><p className="text-[11px] text-gray-400">Origem</p><p className="truncate text-sm font-semibold text-azul">{payload.origin}</p></div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-3">
          <FaCalendarDays className="text-azul-claro" />
          <div><p className="text-[11px] text-gray-400">Saída</p><p className="text-sm font-semibold text-azul">{formatDay(payload.departureDate)}</p></div>
        </div>
      </div>

      <p className="mt-7 text-xs text-gray-400">A primeira busca pode levar alguns instantes enquanto consultamos as fontes de viagem.</p>
    </div>
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
