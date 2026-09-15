import Link from "next/link";
import {
  FaArrowLeft,
  FaBus,
  FaCity,
  FaHeart,
  FaLocationDot,
  FaPlane,
  FaTree,
  FaUmbrellaBeach,
} from "react-icons/fa6";

const preferences = [
  { label: "Praia", icon: <FaUmbrellaBeach /> },
  { label: "Natureza", icon: <FaTree /> },
  { label: "Urbano", icon: <FaCity /> },
  { label: "Avião", icon: <FaPlane /> },
  { label: "Ônibus", icon: <FaBus /> },
];

export default function Perfil() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <Link href="/" className="inline-flex items-center gap-2 text-azul font-semibold text-sm mb-10 hover:gap-3 transition-all">
        <FaArrowLeft /> Voltar para o início
      </Link>

      <div className="mb-10">
        <p className="text-3xl sm:text-4xl font-semibold text-azul mb-2">Meu perfil</p>
        <p className="text-gray-500">Suas informações e preferências de viagem.</p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
        <section className="bg-white border-2 border-gray-100 rounded-2xl p-6 text-center shadow-sm">
          <div className="mx-auto flex items-center justify-center size-24 rounded-full bg-azul-claro text-branco text-3xl font-bold border-4 border-amarelo mb-4">
            MP
          </div>
          <p className="text-xl font-semibold text-azul">Marina Pereira</p>
          <p className="text-sm text-gray-500 mt-1">marina@email.com</p>
          <p className="flex items-center justify-center gap-1 text-sm text-gray-500 mt-2">
            <FaLocationDot className="text-azul-claro" /> Belo Horizonte - MG
          </p>
          <button type="button" className="w-full border-2 border-azul text-azul hover:bg-azul hover:text-branco transition rounded-xl py-2.5 mt-6 font-semibold">
            Editar perfil
          </button>
        </section>

        <div className="flex flex-col gap-6">
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
              <p className="text-2xl font-bold text-azul">R$ 1.240</p>
              <p className="text-xs text-gray-400 mt-1">Economizado</p>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
              <p className="text-2xl font-bold text-azul">6</p>
              <p className="text-xs text-gray-400 mt-1">Viagens planejadas</p>
            </div>
            <div className="bg-white border-2 border-gray-100 rounded-2xl p-5">
              <p className="text-2xl font-bold text-azul">4</p>
              <p className="text-xs text-gray-400 mt-1">Estados visitados</p>
            </div>
          </section>

          <section className="bg-white border-2 border-gray-100 rounded-2xl p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-lg font-semibold text-azul">Preferências de viagem</p>
                <p className="text-sm text-gray-500">Usadas para ordenar suas sugestões.</p>
              </div>
              <FaHeart className="text-amarelo size-5" />
            </div>
            <div className="flex flex-wrap gap-3">
              {preferences.map(({ label, icon }) => (
                <span key={label} className="flex items-center gap-2 bg-ciano/60 text-azul text-sm font-semibold rounded-full py-2 px-4">
                  {icon}
                  {label}
                </span>
              ))}
            </div>
          </section>

          <section className="bg-azul rounded-2xl p-6 text-branco flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p className="text-lg font-semibold mb-1">Continue planejando</p>
              <p className="text-gray-300 text-sm">Descubra onde seu próximo orçamento pode levar você.</p>
            </div>
            <Link href="/#buscar" className="bg-amarelo text-cinza font-semibold rounded-xl py-3 px-5 text-center whitespace-nowrap hover:brightness-95 transition">
              Nova busca
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
