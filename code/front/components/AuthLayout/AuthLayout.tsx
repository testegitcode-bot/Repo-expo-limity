import { ReactNode } from "react";
import Link from "next/link";
import { FaCircleCheck, FaPaperPlane } from "react-icons/fa6";

interface props {
  title: string;
  subtitle: string;
  benefits: string[];
  children: ReactNode;
}

export default function AuthLayout({ title, subtitle, benefits, children }: props) {
  return (
    <div className="grid lg:grid-cols-2 min-h-[calc(100vh-4.5rem)]">
      {/* Painel de marca */}
      <div className="hidden lg:flex relative flex-col justify-center bg-azul text-branco px-14 py-16 overflow-hidden">
        <div className="absolute -top-24 -right-24 size-72 rounded-full bg-azul-claro/20" />
        <div className="absolute -bottom-32 -left-16 size-80 rounded-full bg-ciano/10" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2 mb-12 w-fit">
            <span className="flex items-center justify-center size-9 rounded-xl bg-branco text-azul">
              <FaPaperPlane className="-rotate-45 size-4" />
            </span>
            <span className="text-xl font-extrabold tracking-tight">LIMITY</span>
          </Link>

          <p className="text-3xl xl:text-4xl font-semibold leading-snug mb-4">
            {title}
          </p>
          <p className="text-gray-300 mb-10 leading-relaxed max-w-md">{subtitle}</p>

          <ul className="flex flex-col gap-4">
            {benefits.map((benefit) => (
              <li key={benefit} className="flex items-center gap-3">
                <FaCircleCheck className="text-ciano shrink-0" />
                <span className="text-gray-200">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-sm">
          <Link href="/" className="flex lg:hidden items-center gap-2 mb-10 w-fit mx-auto">
            <span className="flex items-center justify-center size-9 rounded-xl bg-azul text-amarelo">
              <FaPaperPlane className="-rotate-45 size-4" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-azul">
              LIMITY
            </span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
