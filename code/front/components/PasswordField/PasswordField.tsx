"use client";

import { useId, useState, type ChangeEvent } from "react";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa6";

interface props {
  label: string;
  placeholder?: string;
  autoComplete?: string;
  id?: string;
  name?: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordField({ label, placeholder, autoComplete, id: providedId, name, value, onChange }: props) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <label htmlFor={id} className="font-semibold text-sm mb-1 block">
        {label}
      </label>
      <div className="relative">
        <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-11 focus:bg-blue-50"
        />
        <button
          type="button"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          onClick={() => setVisible((current) => !current)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-azul cursor-pointer"
        >
          {visible ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}
