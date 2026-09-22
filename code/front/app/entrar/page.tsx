"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordField from "@/components/PasswordField/PasswordField";
import { ApiError, login } from "@/lib/api";
import { saveSessionToken } from "@/lib/session";
import { FaArrowRight, FaEnvelope, FaGoogle } from "react-icons/fa6";

export default function Entrar() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await login({ email, password });
      saveSessionToken(response.accessToken);
      router.push("/perfil");
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Bem-vindo de volta"
      subtitle="Entre para ver seus roteiros salvos e continuar de onde parou."
      benefits={[
        "Acesse o histórico dos roteiros que você já gerou",
        "Retome roteiros salvos nos favoritos",
        "Receba avisos quando um preço cair",
      ]}
    >
      <p className="text-2xl font-semibold text-azul mb-1">Entrar</p>
      <p className="text-gray-500 mb-8">
        Ainda não tem conta?{" "}
        <Link href="/criar-conta" className="text-azul font-semibold underline underline-offset-2">
          Crie uma agora
        </Link>
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="font-semibold text-sm mb-1 block">
            E-mail
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                            name="email"
                            value={email}
                            onChange={(event) => setEmail(event.currentTarget.value)}
              id="email"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
              className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-4 focus:bg-blue-50"
            />
          </div>
        </div>

        <PasswordField label="Senha" id="password" name="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} placeholder="••••••••" autoComplete="current-password" />

        <div className="flex items-center justify-between text-sm -mt-1">
          <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
            <input type="checkbox" className="accent-azul size-4" />
            Lembrar de mim
          </label>
          <Link href="/recuperar-senha" className="text-azul font-medium">
            Esqueci minha senha
          </Link>
        </div>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-2"
        >{isSubmitting ? "Entrando..." : <>Entrar <FaArrowRight /></>}</button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <span className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-400">ou</span>
        <span className="h-px bg-gray-200 flex-1" />
      </div>

      <button
        type="button"
        disabled
        aria-disabled="true"
        className="w-full border-2 border-gray-200 hover:border-azul-claro transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <FaGoogle className="text-azul-claro" />
        Continuar com Google
      </button>
    </AuthLayout>
  );
}
