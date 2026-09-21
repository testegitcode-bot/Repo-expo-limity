import { Suspense } from "react";
import type { Metadata } from "next";
import ResultsView from "@/components/ResultsView/ResultsView";

export const metadata: Metadata = {
  title: "Resultados | Limity",
};

export default function Resultados() {
  return (
    // useSearchParams (dentro de ResultsView) precisa de uma fronteira Suspense.
    <Suspense fallback={<div className="w-full bg-azul py-24" />}>
      <ResultsView />
    </Suspense>
  );
}
