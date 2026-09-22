"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordField from "@/components/PasswordField/PasswordField";
import { ApiError, forgotPassword, resetPassword } from "@/lib/api";
import { FaArrowLeft, FaCircleCheck, FaCircleInfo, FaEnvelope } from "react-icons/fa6";

export default function RecuperarSenha() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4.5rem)]" />}>
      <RecuperarSenhaForm />
    </Suspense>
  );
}

function RecuperarSenhaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      setResetToken(token);
      setStep("reset");
    }
  }, [searchParams]);

  async function handleRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const response = await forgotPassword(email);
      setResetToken(response.resetToken);
      setStep("reset");
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Não foi possível enviar o link.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReset(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError("As senhas precisam ser iguais.");
      return;
    }
    setIsSubmitting(true);
    try {
      await resetPassword(resetToken, password);
      setStep("done");
    } catch (requestError) {
      setError(requestError instanceof ApiError ? requestError.message : "Não foi possível atualizar a senha.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Recupere seu acesso em 2 minutos"
      subtitle="Enviamos um link seguro, válido por 30 minutos."
      benefits={[
        "O link de redefinição expira em 30 minutos",
        "Sua nova senha substitui a anterior na hora",
        "Por segurança, a mensagem é a mesma exista ou não uma conta",
      ]}
    >
      {step === "request" && (
        <>
          <p className="text-2xl font-semibold text-azul mb-1">Esqueceu a senha?</p>
          <p className="text-gray-500 mb-8">
            Informe o e-mail cadastrado e enviaremos um link de redefinição.
          </p>

          <form className="flex flex-col gap-5" onSubmit={handleRequest}>
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
                  placeholder="seu@email.com"
                  autoComplete="email"
                  required
                  className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-4 focus:bg-blue-50"
                />
              </div>
            </div>

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold mt-2"
            >
              {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>

          <div className="mt-5 rounded-xl border border-azul-claro/30 bg-blue-50 px-4 py-3 text-sm text-azul flex gap-3">
            <FaCircleInfo className="size-4 mt-0.5 shrink-0" />
            <p>Por segurança, exibimos sempre a mesma mensagem, exista ou não uma conta com esse e-mail.</p>
          </div>
        </>
      )}

      {step === "reset" && (
        <>
          <p className="text-2xl font-semibold text-azul mb-1">Defina uma nova senha</p>
          <p className="text-gray-500 mb-8">O link é válido por 30 minutos. Escolha uma senha com no mínimo 8 caracteres.</p>

          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex gap-3">
            <FaCircleCheck className="size-4 mt-0.5 shrink-0" />
            <p>
              <span className="font-semibold">E-mail enviado!</span> Verifique a caixa de entrada e o spam. O link expira em 30 minutos.
            </p>
          </div>

          <form className="flex flex-col gap-5" onSubmit={handleReset}>
            <PasswordField
              label="Nova senha"
              id="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
              placeholder="Mínimo de 8 caracteres"
              autoComplete="new-password"
            />
            <PasswordField
              label="Confirmar senha"
              id="confirmation"
              name="confirmation"
              value={confirmation}
              onChange={(event) => setConfirmation(event.currentTarget.value)}
              placeholder="Repita a senha"
              autoComplete="new-password"
            />

            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold mt-2"
            >
              {isSubmitting ? "Atualizando..." : "Atualizar senha"}
            </button>
          </form>
        </>
      )}

      {step === "done" && (
        <>
          <p className="text-2xl font-semibold text-azul mb-1">Senha atualizada</p>
          <p className="text-gray-500 mb-8">Agora você já pode entrar com a nova senha.</p>
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 flex gap-3">
            <FaCircleCheck className="size-4 mt-0.5 shrink-0" />
            <p>Sua senha foi redefinida com sucesso.</p>
          </div>
          <button
            type="button"
            onClick={() => router.push("/entrar")}
            className="w-full bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold"
          >
            Ir para o login
          </button>
        </>
      )}

      <Link href="/entrar" className="mt-8 inline-flex items-center gap-2 text-azul font-semibold text-sm">
        <FaArrowLeft /> Voltar para o login
      </Link>
    </AuthLayout>
  );
}
