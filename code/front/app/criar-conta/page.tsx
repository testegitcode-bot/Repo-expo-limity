"use client";

import Link from "next/link";
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordField from "@/components/PasswordField/PasswordField";
import { FaArrowRight, FaCheck, FaEnvelope, FaLocationDot, FaUser } from "react-icons/fa6";

export default function CriarConta() {
  const [created, setCreated] = useState(false);

  return (
    <AuthLayout
      title="Crie sua conta e ganhe 100 pontos"
      subtitle="Favoritos ilimitados, histórico de buscas e alertas de queda de preço."
      benefits={[
        "Resultados completos para o seu orçamento",
        "Salve destinos e roteiros favoritos",
        "Planeje sem comprometer o cartão",
      ]}
    >
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
        {created ? (
          <div className="text-center py-8">
            <span className="mx-auto mb-5 flex items-center justify-center size-14 rounded-full bg-ciano text-azul">
              <FaCheck className="size-6" />
            </span>
            <p className="text-2xl font-semibold text-azul mb-2">Conta criada com sucesso</p>
            <p className="text-gray-500 text-sm leading-relaxed mb-7">
              Seu perfil está pronto. Agora você já pode entrar e começar a planejar sua próxima viagem.
            </p>
            <Link
              href="/entrar"
              className="bg-amarelo hover:brightness-95 transition py-3 px-6 rounded-xl font-semibold inline-flex items-center gap-2"
            >
              Ir para o login <FaArrowRight />
            </Link>
          </div>
        ) : (
          <>
            <p className="text-2xl font-semibold text-azul mb-1">Criar conta</p>
            <p className="text-gray-500 mb-8 text-sm">Leva menos de 90 segundos</p>

            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                setCreated(true);
              }}
            >
              <div>
                <label htmlFor="nome" className="font-semibold text-xs uppercase mb-2 block">
                  Nome completo
                </label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="nome"
                    type="text"
                    placeholder="Como podemos te chamar?"
                    autoComplete="name"
                    required
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 focus:border-azul-claro focus:bg-blue-50 outline-none transition"
                  />
                </div>
              </div>

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

              <PasswordField label="Senha" placeholder="Mínimo de 8 caracteres" autoComplete="new-password" />

              <div>
                <label htmlFor="cidade" className="font-semibold text-xs uppercase mb-2 block">
                  Cidade de origem
                </label>
                <div className="relative">
                  <FaLocationDot className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    id="cidade"
                    type="text"
                    placeholder="Belo Horizonte - MG"
                    autoComplete="address-level2"
                    required
                    className="w-full rounded-xl border-2 border-gray-200 py-3 pl-11 pr-4 focus:border-azul-claro focus:bg-blue-50 outline-none transition"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-gray-500 cursor-pointer">
                <input type="checkbox" required className="accent-azul size-4 mt-0.5" />
                Li e aceito os termos de uso e a política de privacidade.
              </label>

              <button
                type="submit"
                className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-1"
              >
                Criar conta <FaArrowRight />
              </button>
            </form>

            <p className="text-xs text-gray-400 text-center mt-6">
              Já tem uma conta?{" "}
              <Link href="/entrar" className="text-azul-claro font-semibold">
                Entrar
              </Link>
            </p>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
