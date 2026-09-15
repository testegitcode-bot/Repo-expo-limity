import { ReactNode } from "react";

interface props {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function IconCard({ icon, title, description }: props) {
  return (
    <div className="flex flex-col border-2 bg-white border-gray-100 p-5 rounded-2xl">
      {icon}
      <span className="font-semibold text-azul">{title}</span>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
