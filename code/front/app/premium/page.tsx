import Link from "next/link";
import PricingCard from "@/components/PricingCard/PricingCard";
import AccordionItem from "@/components/AccordionItem/AccordionItem";
import {
  FaArrowRight,
  FaBan,
  FaCrown,
  FaLock,
  FaRotate,
} from "react-icons/fa6";

const billingFaqs = [
  {
    question: "Posso cancelar quando eu quiser?",
    answer:
      "Sim. Não há fidelidade nem multa: você cancela a renovação a qualquer momento e continua com o Premium até o fim do período já pago.",
  },
  {
    question: "O Premium muda o roteiro que eu recebo?",
    answer:
      "Não. O algoritmo que calcula destino, transporte e hospedagem dentro do seu orçamento é o mesmo para todo mundo. O Premium remove os anúncios e libera recursos extras de conveniência, como favoritos ilimitados e alertas de preço.",
  },
  {
    question: "Como funciona a cobrança?",
    answer:
      "Via cartão de crédito, com renovação automática mensal ou anual. Você recebe um aviso antes de cada cobrança e pode trocar de plano ou cancelar quando quiser.",
  },
];

export default function Premium() {
  return (
    <>
      <div className="flex flex-col w-full bg-azul justify-center py-16 sm:py-20 px-4">
        <span className="flex items-center gap-2 w-fit mx-auto bg-white/10 border border-white/20 text-branco text-xs font-semibold rounded-full py-1.5 px-4 mb-6">
          <FaCrown className="text-amarelo" />
          Limity Premium
        </span>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-branco pb-6 leading-snug">
          A mesma busca inteligente,
          <br />
          agora <span className="text-amarelo">sem anúncios</span>.
        </p>
        <p className="text-gray-400 text-center leading-relaxed max-w-xl mx-auto">
          Continue usando o Limity de graça ou desbloqueie uma experiência
          sem interrupções, com recursos extras para planejar ainda melhor.
        </p>
      </div>

      {/* Confiança */}
      <div className="max-w-4xl mx-auto px-4 flex flex-wrap justify-center gap-x-10 gap-y-3 -mt-8 sm:-mt-10 mb-16 sm:mb-20 relative">
        <div className="bg-white border-2 border-gray-100 rounded-2xl shadow-sm py-4 px-6 sm:px-10 flex flex-wrap justify-center gap-x-10 gap-y-3">
          <span className="flex items-center gap-2 text-sm text-cinza">
            <FaRotate className="text-azul-claro" />
            Cancele quando quiser
          </span>
          <span className="flex items-center gap-2 text-sm text-cinza">
            <FaBan className="text-azul-claro" />
            Sem fidelidade
          </span>
          <span className="flex items-center gap-2 text-sm text-cinza">
            <FaLock className="text-azul-claro" />
            Pagamento seguro
          </span>
        </div>
      </div>

      {/* Planos */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-20 sm:mb-28">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6 items-stretch">
          <PricingCard
            name="Grátis"
            price="R$ 0"
            period="para sempre"
            description="Para conhecer o Limity e planejar sua primeira viagem sem custo."
            features={[
              { text: "Busca ilimitada de roteiros", included: true },
              { text: "Extrato de custos detalhado", included: true },
              { text: "Até 3 roteiros salvos nos favoritos", included: true },
              { text: "Sem anúncios", included: false },
              { text: "Alertas de queda de preço", included: false },
              { text: "Suporte prioritário", included: false },
            ]}
            ctaLabel="Começar grátis"
            ctaHref="/criar-conta"
          />
          <PricingCard
            name="Premium Anual"
            price="R$ 119,90"
            period="/ano"
            description="Equivalente a R$ 9,99/mês. A melhor forma de aproveitar o Premium."
            badge="Economize 33%"
            highlighted
            features={[
              { text: "Busca ilimitada de roteiros", included: true },
              { text: "Extrato de custos detalhado", included: true },
              { text: "Roteiros salvos ilimitados", included: true },
              { text: "Sem anúncios", included: true },
              { text: "Alertas de queda de preço", included: true },
              { text: "Suporte prioritário", included: true },
            ]}
            ctaLabel="Assinar plano anual"
            ctaHref="/criar-conta"
          />
          <PricingCard
            name="Premium Mensal"
            price="R$ 14,90"
            period="/mês"
            description="Sem compromisso de longo prazo, cancele quando quiser."
            features={[
              { text: "Busca ilimitada de roteiros", included: true },
              { text: "Extrato de custos detalhado", included: true },
              { text: "Roteiros salvos ilimitados", included: true },
              { text: "Sem anúncios", included: true },
              { text: "Alertas de queda de preço", included: true },
              { text: "Suporte prioritário", included: true },
            ]}
            ctaLabel="Assinar plano mensal"
            ctaHref="/criar-conta"
          />
        </div>
        <p className="text-xs text-gray-400 text-center italic mt-10">
          Valores meramente ilustrativos para fins deste projeto acadêmico.
          Nenhuma cobrança real é realizada.
        </p>
      </div>

      {/* FAQ de cobrança */}
      <div className="bg-white py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl font-semibold text-azul text-center mb-12">
            Dúvidas sobre o Premium
          </p>
          <div className="flex flex-col gap-4">
            {billingFaqs.map((faq) => (
              <AccordionItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-azul py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-branco mb-4">
            Viaje sem anúncios no caminho
          </p>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Comece grátis quando quiser, ou já assine o Premium e aproveite a
            experiência completa desde a primeira busca.
          </p>
          <Link
            href="/criar-conta"
            className="bg-amarelo inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold cursor-pointer"
          >
            Criar minha conta <FaArrowRight />
          </Link>
        </div>
      </div>
    </>
  );
}
