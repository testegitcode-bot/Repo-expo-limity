"use client";

import municipios from "./municipios.json";
import { useState } from "react";
import {
  FaArrowRight,
  FaBus,
  FaCalendar,
  FaCity,
  FaDog,
  FaLocationDot,
  FaPlane,
  FaTree,
  FaUmbrellaBeach,
} from "react-icons/fa6";

const preferenceOptions = [
  { label: "Praia", icon: <FaUmbrellaBeach /> },
  { label: "Urbano", icon: <FaCity /> },
  { label: "Natureza", icon: <FaTree /> },
  { label: "Ônibus", icon: <FaBus /> },
  { label: "Avião", icon: <FaPlane /> },
  { label: "Pet", icon: <FaDog /> },
];

export default function SearchWidget() {
  const [budget, setBudget] = useState(0);
  const [preferences, setPreferences] = useState<string[]>([]);

  const togglePreference = (preference: string) => {
    setPreferences((currentPreferences) =>
      currentPreferences.includes(preference)
        ? currentPreferences.filter((current) => current !== preference)
        : [...currentPreferences, preference],
    );
  };

  return (
    <div className="bg-white rounded-3xl w-full max-w-190 p-4 sm:p-6">
      <div className="flex flex-col">
        <label htmlFor="input-budget" className="font-semibold">QUANTO VOCÊ PODE GASTAR?</label>
        <div className="relative my-2">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl sm:text-4xl font-bold">
            R$
          </span>
          <input
            id="input-budget"
            className="w-full rounded-xl border-2 border-azul-claro p-3.5 pl-14 sm:pl-18 text-2xl sm:text-4xl font-bold focus:bg-blue-50"
            value={budget}
            type="number"
            onChange={(event) => {
              const value = Number(event.currentTarget.value);
              setBudget(value);
            }}
            inputMode="numeric"
          />
        </div>
        <input
          id="range-input"
          type="range"
          step={10}
          min={150}
          max={10000}
          className="w-full"
          value={budget}
          onChange={(e) => setBudget(Number(e.currentTarget.value))}
        />
        <div className="flex justify-between text-xs sm:text-base mb-4">
          <p className="w-full">R$ 150,00</p>
          <p className="w-full text-center">R$ 5000,00</p>
          <p className="w-full text-end">R$ 10.000,00</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="input-cidade"
              className="flex items-center gap-1 mb-1 pl-1"
            >
              <FaLocationDot />
              Cidade de origem
            </label>
            <div id="input-origem" className="flex items-center">
              <select className="rounded-xl border-azul-claro border-2 h-12 w-full p-3.5 focus:bg-blue-50">
                {municipios.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label
              htmlFor="input-datas"
              className="flex items-center gap-2 mb-1 pl-2"
            >
              <FaCalendar />
              Data de saída
            </label>
            <input
              type="date"
              id="input-datas"
              className="rounded-xl border-azul-claro border-2 h-12 w-full p-3.5 focus:bg-blue-50"
            />
          </div>
          <div className="col-span-1 sm:col-span-2 grid grid-cols-2 gap-2">
            {preferenceOptions.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={preferences.includes(label)}
                  className={`${
                    preferences.includes(label)
                      ? "bg-ciano border-2 border-ciano font-semibold"
                      : "border-2 border-gray-300"
                  } cursor-pointer rounded-full flex items-center gap-2 py-2 px-4`}
                  onClick={() => togglePreference(label)}
                >
                  {icon}
                  {label}
                </button>
              ))}
          </div>
        </div>
        <button className="bg-amarelo cursor-pointer p-3 w-full rounded-xl flex justify-center items-center gap-2">
          ENCONTRAR MINHA VIAGEM <FaArrowRight />
        </button>
      </div>
    </div>
  );
}
