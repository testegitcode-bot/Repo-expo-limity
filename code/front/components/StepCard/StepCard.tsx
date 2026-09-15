import { ReactNode } from "react";

interface props {
  number: number;
  icon: ReactNode;
  title: string;
  description: string;
}

export default function StepCard({ number, icon, title, description }: props) {
  return (
    <div className="relative flex flex-col bg-white border-2 border-gray-100 p-7 pt-9 rounded-2xl h-full">
      <span className="absolute -top-4 -left-4 bg-azul text-branco text-sm font-bold w-9 h-9 rounded-full flex items-center justify-center">
        {number}
      </span>
      <span className="text-azul-claro mb-4">{icon}</span>
      <span className="font-semibold text-azul mb-2">{title}</span>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
