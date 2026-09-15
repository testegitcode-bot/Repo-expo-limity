import Link from "next/link";
import { FaCheck, FaXmark } from "react-icons/fa6";

interface Feature {
  text: string;
  included: boolean;
}

interface props {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: Feature[];
  ctaLabel: string;
  ctaHref: string;
  badge?: string;
  highlighted?: boolean;
}

export default function PricingCard({
  name,
  price,
  period,
  description,
  features,
  ctaLabel,
  ctaHref,
  badge,
  highlighted,
}: props) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-7 h-full ${
        highlighted
          ? "bg-azul text-branco shadow-xl lg:-translate-y-3"
          : "bg-white border-2 border-gray-100"
      }`}
    >
      {badge && (
        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amarelo text-cinza text-xs font-bold rounded-full py-1.5 px-4 whitespace-nowrap">
          {badge}
        </span>
      )}

      <p
        className={`font-semibold mb-1 ${highlighted ? "text-ciano" : "text-azul"}`}
      >
        {name}
      </p>
      <div className="flex items-end gap-1 mb-2">
        <span className="text-3xl font-bold">{price}</span>
        {period && (
          <span className={highlighted ? "text-gray-300" : "text-gray-400"}>
            {period}
          </span>
        )}
      </div>
      <p className={`text-sm mb-6 ${highlighted ? "text-gray-300" : "text-gray-500"}`}>
        {description}
      </p>

      <ul className="flex flex-col gap-3 mb-8 flex-1">
        {features.map((feature) => (
          <li key={feature.text} className="flex items-start gap-2 text-sm">
            {feature.included ? (
              <FaCheck className={`mt-0.5 shrink-0 ${highlighted ? "text-ciano" : "text-azul-claro"}`} />
            ) : (
              <FaXmark className="mt-0.5 shrink-0 text-gray-300" />
            )}
            <span className={feature.included ? "" : "text-gray-400"}>
              {feature.text}
            </span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`text-center py-3 rounded-xl font-semibold transition cursor-pointer ${
          highlighted
            ? "bg-amarelo text-cinza hover:brightness-95"
            : "border-2 border-azul text-azul hover:bg-azul hover:text-branco"
        }`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
