"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordField from "@/components/PasswordField/PasswordField";
import { FaArrowRight, FaEnvelope, FaGoogle } from "react-icons/fa6";

export default function Entrar() {
  const router = useRouter();

  return (
    <AuthLayout
      title="Sua próxima viagem já cabe no seu orçamento."
      subtitle="Entre e retome o planejamento exatamente de onde parou."
      benefits={[
        "Acesse o histórico dos roteiros que você já gerou",
        "Retome roteiros salvos nos favoritos",
        "Receba avisos quando um preço cair",
      ]}
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <p className="text-2xl font-semibold text-azul mb-1">Bem-vindo de volta</p>
        <p className="text-gray-500 mb-8 text-sm">
          Entre para continuar planejando
        </p>

        <form
          className="flex flex-col gap-5"
          onSubmit={(event) => {
            event.preventDefault();
            router.push("/");
          }}
        >
          <div>
            <label htmlFor="email" className="font-semibold text-xs uppercase mb-2 block">
              E-mail
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                autoComplete="email"
                required
                className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 focus:border-azul-claro focus:bg-blue-50 outline-none transition"
              />
            </div>
          </div>

          <PasswordField label="Senha" placeholder="••••••••" autoComplete="current-password" />

          <div className="flex items-center justify-between text-xs -mt-1">
            <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
              <input type="checkbox" className="accent-azul size-4" />
              Manter conectado
            </label>
            <Link href="#" className="text-azul-claro font-medium">
              Esqueci minha senha
            </Link>
          </div>

          <button
            type="submit"
            className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-1"
          >
            Entrar <FaArrowRight />
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <span className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">ou continue com</span>
          <span className="h-px bg-gray-200 flex-1" />
        </div>

        <button
          type="button"
          className="w-full border-2 border-gray-200 hover:border-azul-claro transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <FaGoogle className="text-azul-claro" />
          Google
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          Não tem conta?{" "}
          <Link href="/criar-conta" className="text-azul-claro font-semibold">
            Crie uma grátis
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
