import Link from "next/link";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordField from "@/components/PasswordField/PasswordField";
import { FaArrowRight, FaEnvelope, FaGoogle } from "react-icons/fa6";

export default function Entrar() {
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

      <div className="flex flex-col gap-5">
        <div>
          <label htmlFor="email" className="font-semibold text-sm mb-1 block">
            E-mail
          </label>
          <div className="relative">
            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              id="email"
              type="email"
              placeholder="voce@email.com"
              autoComplete="email"
              className="w-full rounded-xl border-2 border-azul-claro py-3 pl-11 pr-4 focus:bg-blue-50"
            />
          </div>
        </div>

        <PasswordField label="Senha" placeholder="••••••••" autoComplete="current-password" />

        <div className="flex items-center justify-between text-sm -mt-1">
          <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
            <input type="checkbox" className="accent-azul size-4" />
            Lembrar de mim
          </label>
          <Link href="#" className="text-azul font-medium">
            Esqueci minha senha
          </Link>
        </div>

        <button
          type="button"
          className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mt-2"
        >
          Entrar <FaArrowRight />
        </button>
      </div>

      <div className="flex items-center gap-3 my-6">
        <span className="h-px bg-gray-200 flex-1" />
        <span className="text-xs text-gray-400">ou</span>
        <span className="h-px bg-gray-200 flex-1" />
      </div>

      <button
        type="button"
        className="w-full border-2 border-gray-200 hover:border-azul-claro transition cursor-pointer py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
      >
        <FaGoogle className="text-azul-claro" />
        Continuar com Google
      </button>
    </AuthLayout>
  );
}
