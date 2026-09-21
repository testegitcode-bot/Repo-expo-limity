"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordField from "@/components/PasswordField/PasswordField";
import { ApiError, register } from "@/lib/api";
import { saveSessionToken } from "@/lib/session";
import { FaArrowRight, FaEnvelope, FaGoogle, FaUser } from "react-icons/fa6";

export default function CriarConta() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("As senhas precisam ser iguais.");
      return;
    }
    if (!acceptedTerms) {
      setError("Aceite os termos de uso e a política de privacidade para continuar.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await register({ name, email, password });
      saveSessionToken(response.accessToken);
      router.push("/perfil");
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Não foi possível criar sua conta.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Comece a economizar na próxima viagem"
      subtitle="Crie sua conta gratuita e deixe o Limity montar roteiros que cabem no seu bolso."
      benefits={[
        "Roteiros sob medida para o seu orçamento",
        "Comparação de passagens em segundos",
        "Salve destinos e roteiros favoritos",
      ]}
    >
      <p className="text-2xl font-semibold text-azul mb-1">Criar conta</p>
      <p className="text-gray-500 mb-8">
        Já tem uma conta?{" "}
        <Link href="/entrar" className="text-azul font-semibold underline underline-offset-2">
          Entrar
        </Link>
      </p>

      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="nome" className="font-semibold text-sm mb-1 block">
            Nome completo
          </label>
          <div className="relative">
            <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                            name="name"
                            value={name}
                            onChange={(event) => setName(event.currentTarget.value)}
              id="nome"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-4 focus:bg-blue-50"
            />
          </div>
        </div>

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

        <PasswordField label="Senha" id="password" name="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} placeholder="Mínimo de 8 caracteres" autoComplete="new-password" />
        <PasswordField label="Confirmar senha" id="confirmation" name="confirmation" value={confirmation} onChange={(event) => setConfirmation(event.currentTarget.value)} placeholder="Repita a senha" autoComplete="new-password" />

        <label className="flex items-start gap-2 text-sm text-gray-500 cursor-pointer">
          <input type="checkbox" checked={acceptedTerms} onChange={(event) => setAcceptedTerms(event.currentTarget.checked)} className="accent-azul size-4 mt-0.5" />
          Aceito os{" "}
          <Link href="#" className="text-azul font-medium">
            termos de uso
          </Link>{" "}
          e a{" "}
          <Link href="#" className="text-azul font-medium">
            política de privacidade
          </Link>
        </label>

        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-2"
        >
          {isSubmitting ? "Criando conta..." : <>Criar conta <FaArrowRight /></>}
        </button>
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
