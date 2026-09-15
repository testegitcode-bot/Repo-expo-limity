import Link from "next/link";
import StepCard from "@/components/StepCard/StepCard";
import IconCard from "@/components/IconCard/IconCard";
import {
  FaArrowRight,
  FaBus,
  FaChartPie,
  FaCircleCheck,
  FaClock,
  FaFileInvoiceDollar,
  FaGlobe,
  FaHeart,
  FaHotel,
  FaMagnifyingGlass,
  FaPlane,
  FaRobot,
  FaShieldHeart,
  FaSuitcaseRolling,
  FaWallet,
} from "react-icons/fa6";

const sources = [
  { name: "Decolar", icon: <FaPlane /> },
  { name: "Kayak", icon: <FaMagnifyingGlass /> },
  { name: "123Milhas", icon: <FaPlane /> },
  { name: "ClickBus", icon: <FaBus /> },
  { name: "CVC", icon: <FaSuitcaseRolling /> },
  { name: "Booking", icon: <FaHotel /> },
];

const extrato = [
  { label: "Passagem (ida e volta)", value: "R$ 640,00" },
  { label: "Hospedagem (3 noites)", value: "R$ 510,00" },
  { label: "Estimativa de gastos diários", value: "R$ 350,00" },
];

export default function ComoFunciona() {
  return (
    <>
      <div className="flex flex-col w-full bg-azul justify-center py-16 sm:py-20 px-4">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-center text-branco pb-6 leading-snug">
          Como o Limity funciona
        </p>
        <p className="text-gray-400 text-center leading-relaxed">
          Você diz o quanto pode gastar. A gente cuida do resto: destino,
          <br className="hidden sm:block" />
          dias, transporte e hospedagem, tudo dentro do seu bolso.
        </p>
      </div>

      {/* Passo a passo */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-20 sm:mt-24 mb-24">
        <p className="text-2xl font-semibold text-azul text-center mb-3">
          Do orçamento ao embarque, em 4 passos
        </p>
        <p className="text-gray-500 text-center mb-12">
          Todo o processo acontece em segundos — você só decide se vai.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          <StepCard
            number={1}
            icon={<FaWallet className="size-6" />}
            title="Conte o que você quer"
            description="Informe o valor máximo que pode gastar, sua cidade de origem, as datas e preferências como praia, urbano, natureza, se pode ser de ônibus ou avião e se vai levar pet."
          />
          <StepCard
            number={2}
            icon={<FaGlobe className="size-6" />}
            title="Buscamos em várias fontes"
            description="Consultamos APIs de companhias aéreas, rodoviárias e agregadores como Decolar, Kayak, 123Milhas e ClickBus, trazendo preços de passagens e hospedagem atualizados em tempo real."
          />
          <StepCard
            number={3}
            icon={<FaRobot className="size-6" />}
            title="Cruzamos e otimizamos"
            description="Nosso algoritmo descarta tudo que estoura o orçamento e testa milhares de combinações de destino, duração e transporte até achar a de melhor custo-benefício, em até 10 segundos."
          />
          <StepCard
            number={4}
            icon={<FaSuitcaseRolling className="size-6" />}
            title="Você recebe o roteiro"
            description="Destino, datas, passagem e hospedagem definidos, com extrato detalhado de custos. Gostou? Salve nos favoritos e decida com calma."
          />
        </div>
      </div>

      {/* Fontes de preços */}
      <div className="bg-white py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl font-semibold text-azul text-center mb-3">
            De onde vêm os preços
          </p>
          <p className="text-gray-500 text-center mb-12 leading-relaxed">
            O Limity não vende passagens: ele compara, em tempo real, o que as
            <br className="hidden sm:block" />
            principais plataformas de viagem estão cobrando.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {sources.map(({ name, icon }) => (
              <span
                key={name}
                className="flex items-center gap-2 border-2 border-gray-200 rounded-full py-2.5 px-5 text-cinza font-medium"
              >
                <span className="text-azul-claro">{icon}</span>
                {name}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 text-center italic max-w-lg mx-auto">
            Exemplos de parceiros que pretendemos integrar. A lista final de
            fontes pode variar conforme a disponibilidade das APIs.
          </p>
        </div>
      </div>

      {/* Extrato de exemplo */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <p className="text-2xl font-semibold text-azul mb-4">
            Sem surpresa no final
          </p>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Toda sugestão de viagem vem com um extrato claro mostrando
            exatamente como o seu orçamento foi distribuído — passagem,
            hospedagem e estimativa de gastos do dia a dia.
          </p>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3 text-cinza">
              <FaCircleCheck className="text-azul-claro shrink-0" />
              Cálculo automático em menos de 10 segundos
            </li>
            <li className="flex items-center gap-3 text-cinza">
              <FaCircleCheck className="text-azul-claro shrink-0" />
              Nada além do valor que você definiu
            </li>
            <li className="flex items-center gap-3 text-cinza">
              <FaCircleCheck className="text-azul-claro shrink-0" />
              Roteiros salvos no seu histórico e favoritos
            </li>
          </ul>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-7 sm:p-8">
          <p className="font-semibold text-azul mb-6">
            Exemplo · Praia para 3 dias
          </p>
          <div className="flex flex-col gap-4 mb-6">
            {extrato.map(({ label, value }) => (
              <div key={label} className="flex justify-between gap-4 text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-medium text-cinza whitespace-nowrap">
                  {value}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t-2 border-gray-100 pt-5 flex justify-between items-center">
            <span className="font-semibold text-azul">Total</span>
            <span className="font-bold text-azul text-xl">R$ 1.500,00</span>
          </div>
          <div className="mt-5 bg-ciano/30 text-azul text-xs font-medium rounded-lg py-2.5 px-3 flex items-center gap-2">
            <FaChartPie className="shrink-0" />
            Dentro do orçamento informado de R$ 1.500,00
          </div>
        </div>
      </div>

      {/* Diferenciais */}
      <div className="bg-white py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-2xl font-semibold text-azul text-center mb-12">
            Por que usar o Limity
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <IconCard
              icon={<FaClock className="mb-2 size-6 text-azul-claro" />}
              title="Rápido"
              description="Resultado em até 10 segundos, sem pesquisar em dezenas de abas."
            />
            <IconCard
              icon={<FaFileInvoiceDollar className="mb-2 size-6 text-azul-claro" />}
              title="Transparente"
              description="Extrato detalhado de cada real do seu orçamento."
            />
            <IconCard
              icon={<FaShieldHeart className="mb-2 size-6 text-azul-claro" />}
              title="Sem dívidas"
              description="Sugestões sempre dentro do limite que você definiu."
            />
            <IconCard
              icon={<FaHeart className="mb-2 size-6 text-azul-claro" />}
              title="Na sua conta"
              description="Salve roteiros favoritos e retome a busca quando quiser."
            />
          </div>
        </div>
      </div>

      {/* CTA final */}
      <div className="bg-azul py-16 sm:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-2xl sm:text-3xl font-semibold text-branco mb-4">
            Pronto para descobrir sua próxima viagem?
          </p>
          <p className="text-gray-400 mb-10 leading-relaxed">
            Informe seu orçamento e deixe o Limity montar o roteiro perfeito
            para o seu bolso.
          </p>
          <Link
            href="/"
            className="bg-amarelo inline-flex items-center gap-2 py-3 px-6 rounded-xl font-semibold cursor-pointer"
          >
            Simular minha viagem agora <FaArrowRight />
          </Link>
        </div>
      </div>
    </>
  );
}
