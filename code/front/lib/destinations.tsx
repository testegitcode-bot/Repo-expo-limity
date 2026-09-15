import {
  FaCity,
  FaEarthAmericas,
  FaLandmark,
  FaMountain,
  FaTree,
  FaUmbrellaBeach,
} from "react-icons/fa6";

export const categories = [
  { key: "praia", label: "Praia", icon: <FaUmbrellaBeach /> },
  { key: "natureza", label: "Natureza", icon: <FaTree /> },
  { key: "urbano", label: "Urbano", icon: <FaCity /> },
  { key: "serra", label: "Serra", icon: <FaMountain /> },
  { key: "historico", label: "Histórico", icon: <FaLandmark /> },
  { key: "internacional", label: "Internacional", icon: <FaEarthAmericas /> },
] as const;

export type CategoryKey = (typeof categories)[number]["key"];

export function getCategory(key: CategoryKey) {
  return categories.find((category) => category.key === key)!;
}

function img(id: string) {
  return `https://images.unsplash.com/photo-${id}?w=800&h=600&fit=crop&q=80&auto=format`;
}

export interface RawDestination {
  id: string;
  name: string;
  state: string;
  category: CategoryKey;
  image: string;
  description: string;
  priceFrom: number;
  days: string;
}

export const rawDestinations: RawDestination[] = [
  {
    id: "rio-de-janeiro",
    name: "Rio de Janeiro",
    state: "RJ",
    category: "urbano",
    image: img("1483729558449-99ef09a8c325"),
    description:
      "Pão de Açúcar, praias urbanas e a Baía de Guanabara em um só roteiro. Clássico para todo tipo de orçamento.",
    priceFrom: 480,
    days: "3 a 5 dias",
  },
  {
    id: "sao-paulo",
    name: "São Paulo",
    state: "SP",
    category: "urbano",
    image: img("1543059080-f9b1272213d5"),
    description:
      "Gastronomia, museus e vida noturna sem parar. Ótimo custo-benefício partindo de qualquer região do país.",
    priceFrom: 350,
    days: "2 a 4 dias",
  },
  {
    id: "porto-de-galinhas",
    name: "Porto de Galinhas",
    state: "PE",
    category: "praia",
    image: img("1509233725247-49e657c54213"),
    description:
      "Piscinas naturais de água morna, coqueiros e o litoral mais charmoso do Nordeste.",
    priceFrom: 890,
    days: "4 a 6 dias",
  },
  {
    id: "maragogi",
    name: "Maragogi",
    state: "AL",
    category: "praia",
    image: img("1507525428034-b723cf961d3e"),
    description:
      "Conhecido como o Caribe brasileiro, com águas cristalinas e recifes de corais.",
    priceFrom: 950,
    days: "4 a 6 dias",
  },
  {
    id: "buzios",
    name: "Búzios",
    state: "RJ",
    category: "praia",
    image: img("1473116763249-2faaef81ccda"),
    description:
      "Charme, orla badalada e mais de 20 praias para escolher a sua favorita.",
    priceFrom: 520,
    days: "3 a 4 dias",
  },
  {
    id: "bonito",
    name: "Bonito",
    state: "MS",
    category: "natureza",
    image: img("1546587348-d12660c30c50"),
    description:
      "Rios de água verde-esmeralda, flutuação e um dos ecoturismos mais premiados do Brasil.",
    priceFrom: 1200,
    days: "4 a 5 dias",
  },
  {
    id: "foz-do-iguacu",
    name: "Foz do Iguaçu",
    state: "PR",
    category: "natureza",
    image: img("1432405972618-c60b0225b8f9"),
    description:
      "As Cataratas do Iguaçu de perto: uma das sete maravilhas naturais do mundo.",
    priceFrom: 780,
    days: "3 a 4 dias",
  },
  {
    id: "gramado",
    name: "Gramado",
    state: "RS",
    category: "serra",
    image: img("1552083375-1447ce886485"),
    description:
      "Clima de serra, arquitetura europeia e passeios pelos lagos da região.",
    priceFrom: 690,
    days: "3 a 5 dias",
  },
  {
    id: "ilha-grande",
    name: "Ilha Grande",
    state: "RJ",
    category: "praia",
    image: img("1520250497591-112f2f40a3f4"),
    description:
      "Sem carros, cercada de mata atlântica: praias praticamente intocadas a uma balsa de distância.",
    priceFrom: 610,
    days: "3 a 4 dias",
  },
  {
    id: "ouro-preto",
    name: "Ouro Preto",
    state: "MG",
    category: "historico",
    image: img("1467269204594-9661b134dd2b"),
    description:
      "Ladeiras de pedra, igrejas barrocas e história do ciclo do ouro em cada esquina.",
    priceFrom: 430,
    days: "2 a 3 dias",
  },
  {
    id: "chapada-diamantina",
    name: "Chapada Diamantina",
    state: "BA",
    category: "natureza",
    image: img("1509316785289-025f5b846b35"),
    description:
      "Cânions, cachoeiras e trilhas para quem viaja com a mochila e a câmera prontas.",
    priceFrom: 970,
    days: "5 a 7 dias",
  },
  {
    id: "salvador",
    name: "Salvador",
    state: "BA",
    category: "historico",
    image: img("1512813195386-6cf811ad3542"),
    description:
      "Pelourinho colorido, axé e a cultura afro-brasileira que deu origem ao Brasil.",
    priceFrom: 650,
    days: "4 a 5 dias",
  },
  {
    id: "recife",
    name: "Recife",
    state: "PE",
    category: "urbano",
    image: img("1548574505-5e239809ee19"),
    description:
      "A Veneza brasileira: pontes, rios e um centro histórico à beira-mar.",
    priceFrom: 590,
    days: "3 a 4 dias",
  },
  {
    id: "maldivas",
    name: "Maldivas",
    state: "Internacional",
    category: "internacional",
    image: img("1573843981267-be1999ff37cd"),
    description:
      "Quando o orçamento permite: bangalôs sobre o mar turquesa do Oceano Índico.",
    priceFrom: 4800,
    days: "5 a 7 dias",
  },
];
