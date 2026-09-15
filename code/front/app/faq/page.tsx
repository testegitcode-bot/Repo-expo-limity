import Link from "next/link";
import StepCard from "@/components/StepCard/StepCard";
import AccordionItem from "@/components/AccordionItem/AccordionItem";
import {
  FaArrowRight,
  FaCalendar,
  FaCircleCheck,
  FaHeart,
  FaSliders,
  FaUserPlus,
  FaWallet,
} from "react-icons/fa6";

const faqs = [
  {
    question: "Preciso pagar para usar o Limity?",
    answer:
      "Não. A busca e a geração de roteiros são gratuitas. Existe também o Limity Premium, um plano opcional sem anúncios e com recursos extras — mas ele não é obrigatório para montar sua viagem.",
  },
  {
    question: "De onde vêm os preços mostrados?",
    answer:
      "O Limity consulta, em tempo real, plataformas parceiras de passagens aéreas, rodoviárias e hospedagem (como Decolar, Kayak, 123Milhas e ClickBus) e mostra apenas as combinações que cabem no valor que você informou.",
  },
  {
    question: "Posso mudar as datas ou o orçamento depois de gerar um roteiro?",
    answer:
      "Sim. Basta voltar para a página inicial, ajustar o valor, as datas ou as preferências e clicar em \"Encontrar minha viagem\" novamente para gerar um novo roteiro.",
  },
  {
    question: "O que acontece se nenhuma viagem couber no meu orçamento?",
    answer:
      "O Limity avisa e sugere o ajuste mais próximo possível: um pouco mais de orçamento, uma data mais barata ou um destino alternativo dentro das suas preferências.",
  },
  {
    question: "Preciso criar uma conta para buscar uma viagem?",
    answer:
      "Não é obrigatório para ver um roteiro. Mas criar conta é grátis e necessário para salvar roteiros no histórico e nos favoritos, para consultar depois.",
  },
  {
    question: "Quanto tempo demora para gerar um roteiro?",
    answer:
      "Até 10 segundos. Nesse tempo o Limity testa milhares de combinações de transporte, hospedagem e duração de viagem antes de mostrar o resultado.",
  },
];

export default function Faq() {
  return (
    <>
      <div className="flex flex-col w-full bg-azul justify-center py-16 sm:py-20 px-4">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-branco pb-6 leading-snug">
          Central de Ajuda
        </p>
        <p className="text-gray-400 text-center leading-relaxed max-w-xl mx-auto">
          Veja o passo a passo para descobrir, em segundos, qual viagem cabe
          no seu orçamento.
        </p>
      </div>

      {/* Passo a passo */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24 mb-24">
        <p className="text-2xl font-semibold text-azul text-center mb-3">
          Como montar o seu roteiro
        </p>
        <p className="text-gray-500 text-center mb-12">
          Do zero até o roteiro pronto, em 5 passos simples.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
          <StepCard
            number={1}
            icon={<FaUserPlus className="size-6" />}
            title="Crie sua conta (opcional)"
            description="Cadastre-se gratuitamente se quiser salvar roteiros e favoritos. Para só olhar preços, pode pular esta etapa."
          />
          <StepCard
            number={2}
            icon={<FaWallet className="size-6" />}
            title="Informe o orçamento"
            description="Na tela inicial, digite ou arraste o controle até o valor máximo que você pode gastar na viagem."
          />
          <StepCard
            number={3}
            icon={<FaCalendar className="size-6" />}
            title="Escolha origem e data"
            description="Selecione a sua cidade de partida e a data (ou período) em que pretende viajar."
          />
          <StepCard
            number={4}
            icon={<FaSliders className="size-6" />}
            title="Marque suas preferências"
            description="Praia, urbano ou natureza? Ônibus ou avião? Vai levar pet? Marque o que combina com a sua viagem."
          />
          <StepCard
            number={5}
            icon={<FaCircleCheck className="size-6" />}
            title="Clique em encontrar viagem"
            description="Em até 10 segundos você recebe o destino, a duração e o extrato completo de custos da viagem."
          />
          <StepCard
            number={6}
            icon={<FaHeart className="size-6" />}
            title="Salve nos favoritos"
            description="Gostou do resultado? Salve no seu histórico para decidir com calma ou comparar com outra busca depois."
          />
        </div>
      </div>

      {/* Perguntas frequentes */}
      <div className="bg-white py-16 sm:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-2xl font-semibold text-azul text-center mb-3">
            Perguntas frequentes
          </p>
          <p className="text-gray-500 text-center mb-12">
            Não achou o que procurava? Fale com a gente pelo suporte.
          </p>
          <div className="flex flex-col gap-4">
            {faqs.map((faq) => (
              <AccordionItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-azul py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-branco mb-4">
            Pronto para testar na prática?
          </p>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Informe o seu orçamento e veja o Limity montar um roteiro completo
            em segundos.
          </p>
          <Link
            href="/"
            className="bg-amarelo inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold cursor-pointer"
          >
            Simular minha viagem <FaArrowRight />
          </Link>
        </div>
      </div>
    </>
  );
}
