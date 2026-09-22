"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaPaperPlane, FaXmark } from "react-icons/fa6";
import { getCurrentUser } from "@/lib/api";
import { clearSessionToken, getSessionToken } from "@/lib/session";

interface props {
  isLogged: boolean;
}

const links = [
  { href: "/como-funciona", label: "Como funciona" },
  { href: "/destinos", label: "Destinos" },
  { href: "/premium", label: "Premium" },
  { href: "/faq", label: "Ajuda" },
  { href: "/perfil", label: "Perfil" },
];

export default function Navbar({ isLogged }: props) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(isLogged ? true : null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const token = getSessionToken();
    if (!token) {
      setHasSession(false);
      return;
    }
    setHasSession(true);
    getCurrentUser(token).catch(() => {
      clearSessionToken();
      setHasSession(false);
    });
  }, [pathname]);

  function logout() {
    clearSessionToken();
    setHasSession(false);
    setIsOpen(false);
    router.replace("/");
  }

  return (
    <header className="sticky top-0 z-50 bg-branco/90 backdrop-blur-sm border-b border-gray-200/80">
      <nav className="max-w-6xl mx-auto flex justify-between items-center px-4 sm:px-6 h-18">
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0"
            onClick={() => setIsOpen(false)}
          >
            <span className="flex items-center justify-center size-9 rounded-xl bg-azul text-amarelo">
              <FaPaperPlane className="-rotate-45 size-4" />
            </span>
            <span className="text-xl font-extrabold text-azul tracking-tight">
              LIMITY
            </span>
          </Link>
          <div className="hidden lg:flex items-center gap-1">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`cursor-pointer py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-azul/10 text-azul"
                      : "text-cinza hover:bg-gray-100 hover:text-azul"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        <div className="hidden lg:flex w-auto justify-end items-center gap-3">
          {hasSession ? (
            <button type="button" onClick={logout} className="border-2 border-gray-200 hover:border-azul py-2 px-5 rounded-xl font-semibold text-cinza hover:text-azul transition-colors">
              Sair
            </button>
          ) : (
            <>
              <Link href="/entrar" className="border-2 border-gray-200 hover:border-azul py-2 px-5 rounded-xl font-semibold text-cinza hover:text-azul transition-colors">
                Entrar
              </Link>
              <Link href="/criar-conta" className="bg-amarelo hover:brightness-95 shadow-sm hover:shadow-md py-2 px-5 rounded-xl font-semibold transition">
                Criar Conta
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isOpen}
          className="lg:hidden text-2xl text-azul cursor-pointer p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen ? <FaXmark /> : <FaBars />}
        </button>
      </nav>

      <div
        className={`lg:hidden grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="min-h-0 overflow-hidden border-t border-gray-200/80 bg-branco">
          <div className="flex flex-col py-2">
            {links.map(({ href, label }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`cursor-pointer py-3 px-6 transition-colors ${
                    isActive ? "text-azul font-semibold bg-azul/5" : "hover:bg-gray-100"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {label}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 px-6 pt-4 pb-3">
              {hasSession ? (
                <button type="button" onClick={logout} className="border-2 border-gray-200 py-2 px-4 rounded-xl text-center font-semibold">
                  Sair
                </button>
              ) : (
                <>
                  <Link href="/entrar" className="border-2 border-gray-200 py-2 px-4 rounded-xl text-center font-semibold" onClick={() => setIsOpen(false)}>
                    Entrar
                  </Link>
                  <Link href="/criar-conta" className="bg-amarelo py-2 px-4 rounded-xl text-center font-semibold" onClick={() => setIsOpen(false)}>
                    Criar Conta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
