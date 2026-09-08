# ✈️ Limity

O **Limity** é uma plataforma inteligente de planejamento de viagens (disponível para Web e Mobile) que visa democratizar e facilitar o turismo. O sistema inverte a lógica tradicional de planejamento: em vez de o usuário escolher um destino e tentar encaixar no bolso, ele simplesmente informa o seu **orçamento máximo** e a sua disponibilidade. A partir disso, o Limity processa os dados e monta automaticamente a melhor opção de viagem possível — incluindo destino, quantidade de dias e passagens (aéreas ou terrestres) — garantindo o menor custo e o máximo de aproveitamento.

O objetivo principal é remover a fricção e o estresse da busca por viagens baratas, oferecendo roteiros otimizados que se encaixam perfeitamente na realidade financeira de cada usuário, provando que viajar não precisa ser sinônimo de estourar o limite do cartão.

---

## 👥 Personas

Para guiar o desenvolvimento do sistema, definimos os perfis de usuários ideais que utilizarão o Limity:

1. **Lucas (O Universitário Econômico):** Tem 21 anos, é estudante e estagiário. Ama explorar lugares novos nos feriados, mas tem um orçamento muito restrito. Ele não tem muito tempo para ficar comparando preços em dezenas de sites e precisa de uma solução rápida que diga: *"Com seus R$ 500, você pode ir para este destino por 3 dias"*.
2. **Marina (A Planejadora Familiar):** Tem 34 anos e quer viajar com o parceiro no final do ano. Eles têm um valor exato guardado (ex: R$ 3.000) e não podem contrair dívidas. Marina valoriza o controle financeiro e precisa de uma ferramenta que entregue um pacote viável dentro do limite exato que ela determinou, poupando o tempo de planejamento.

---

## 📋 Requisitos do Sistema

### Requisitos Funcionais (RF)
* **RF01 - Cadastro e Autenticação:** O sistema deve permitir que os usuários criem contas e façam login.
* **RF02 - Entrada de Orçamento:** O sistema deve permitir que o usuário insira o valor máximo que deseja gastar, sua cidade de origem e datas/período de preferência.
* **RF03 - Geração Automática de Roteiro:** O sistema deve calcular e sugerir destinos, duração da viagem e opções de transporte (passagens) que se enquadrem no orçamento informado.
* **RF04 - Integração de Preços:** O sistema deve buscar valores atualizados de passagens através de APIs de terceiros (ex: voos e ônibus).
* **RF05 - Detalhamento de Custos:** O sistema deve exibir um extrato claro mostrando como o orçamento será distribuído (valor da passagem, estimativa de gastos diários, etc.).
* **RF06 - Histórico e Favoritos:** O usuário deve poder salvar os roteiros gerados para consulta futura.

### Requisitos Não Funcionais (RNF)
* **RNF01 - Plataforma Web:** A interface web deve ser desenvolvida utilizando a biblioteca **React**.
* **RNF02 - Plataforma Mobile:** O aplicativo móvel deve ser desenvolvido utilizando o framework **Flutter**, garantindo compatibilidade com Android e iOS.
* **RNF03 - Responsividade:** A aplicação web deve se adaptar adequadamente a diferentes tamanhos de tela.
* **RNF04 - Desempenho:** A geração do roteiro (busca e cálculo) não deve ultrapassar 10 segundos para não prejudicar a experiência do usuário.
* **RNF05 - Arquitetura de API:** A comunicação entre o frontend (Web/Mobile) e o backend deve ser feita exclusivamente via API RESTful.

---

## 🏗️ Arquitetura do Sistema

O projeto adota uma arquitetura do tipo **Cliente-Servidor**, dividida para atender as plataformas solicitadas através de um backend centralizado.

* **Frontend Web (React):** 
  Responsável pela interface acessada via navegadores. Construído em React (sugere-se o uso de TypeScript e Vite/Next.js). Ele consome a API do backend para enviar o orçamento do usuário e renderizar os roteiros de forma dinâmica.
* **Frontend Mobile (Flutter):**
  Aplicativo cross-platform (Android e iOS) desenvolvido em Flutter e Dart. Possui telas otimizadas para navegação por toque e consome a mesma API que o sistema Web, garantindo que o usuário tenha a mesma experiência e os mesmos dados em qualquer dispositivo.
* **Backend (API REST):**
  Serviço central que concentra toda a regra de negócio. Ele recebe o orçamento, conecta-se a serviços de terceiros (APIs de companhias aéreas ou agregadores de passagens) e executa o algoritmo de otimização de custo para montar o pacote. *(Sugere-se Java/Spring Boot, Node.js ou Python).*
* **Banco de Dados:**
  Responsável por armazenar dados de usuários, perfis, históricos de buscas e roteiros salvos (sugere-se um banco relacional como MySQL ou PostgreSQL).

---

## 🧑‍💻 Integrantes

* Rafael Moreira Barbosa Baptista
* Gabriel Reis
* Heleno Junior Fernandes Vilaça
* Lucas Gonçalves Dolabela
* Mateus Azevedo Araújo
* Vinícius Zegarra Palhares

## 🎓 Orientadores

* Artur Martins Mol
* João Paulo Carneiro Aramuni
* Leonardo Vilela Cardoso

---

## 🚀 Instruções de Utilização

*(Assim que a primeira versão do sistema estiver disponível, deverá complementar com as instruções de utilização. Descreva como instalar eventuais dependências e como executar a aplicação).*

### Pré-requisitos
* Node.js (para o ambiente Web)
* Flutter SDK (para o ambiente Mobile)
* [Adicionar banco de dados ou outras dependências do Backend]

### Rodando o projeto Web (React)
```bash
# Clone este repositório
$ git clone [https://github.com/seu-usuario/limity.git](https://github.com/seu-usuario/limity.git)

# Acesse a pasta do projeto web
$ cd limity/web

# Instale as dependências
$ npm install

# Execute a aplicação
$ npm run dev
