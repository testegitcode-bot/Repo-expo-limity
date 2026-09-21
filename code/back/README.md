# Backend Limity (Spring Boot)

API que recebe o que o cliente marcou na tela inicial (orçamento, origem, data, preferências) e devolve
**pacotes de viagem que cabem no orçamento**: transporte (voo ou ônibus) + hotel.

Spring Boot 4.1 · Java 17 · Maven. Só APIs gratuitas nesta fase (protótipo).

## Rodando

```bash
cd code/back
cp .env.example .env      # já existe um .env vazio; preencha as chaves (veja abaixo)
./mvnw spring-boot:run    # http://localhost:8080
./mvnw test
```

## Autenticação

O cadastro e o login usam PostgreSQL, BCrypt e JWT. Configure no `.env`:

```properties
DB_URL=jdbc:postgresql://localhost:5432/limity
DB_USERNAME=postgres
DB_PASSWORD=postgres
JWT_SECRET=uma-chave-com-pelo-menos-32-caracteres
JWT_EXPIRATION=PT2H
```

Endpoints:

- `POST /api/v1/auth/register` com `name`, `email` e `password`; retorna `201` e um access token.
- `POST /api/v1/auth/login` com `email` e `password`; retorna um access token.
- `GET /api/v1/auth/me` exige `Authorization: Bearer <token>`.

O frontend salva o token da sessão em `sessionStorage`. A busca, o catálogo, as origens e os providers continuam públicos nesta etapa.

Rode sempre a partir de `code/back`: é de lá que o `.env` é lido. O `.env` está no `.gitignore`.
Se a porta 8080 estiver ocupada, use `PORT=8081` no `.env`.

Depois de preencher o `.env`, valide as chaves com uma chamada real em cada provedor:

```bash
curl http://localhost:8080/api/v1/providers/check
```

## APIs usadas (todas gratuitas)

| Uso | Provedor | Chave no `.env` | Observação |
|---|---|---|---|
| Voos | Travelpayouts / Aviasales Data API | `TRAVELPAYOUTS_TOKEN`, `TRAVELPAYOUTS_MARKER` | Preços em **cache** (buscas recentes de usuários), não em tempo real. O marker gera comissão nos links. |
| Hotéis | LiteAPI (Nuitée) | `LITEAPI_KEY` | Chave `sand_` = dados de teste; chave de produção = dados reais. |
| Fotos | Pexels | `PEXELS_API_KEY` | Opcional. 200 req/h e 20 mil/mês. Exige crédito ao fotógrafo (vai na resposta). |
| Cidades/aeroportos | Travelpayouts Places e Airports | — | Sem chave. |
| Coordenadas de municípios | Open-Meteo Geocoding | — | Sem chave. **Grátis só para uso não comercial.** |
| Ônibus | (estimativa própria) | — | Não existe API gratuita; ver "Ônibus" abaixo. |

Sem uma chave, aquele provedor fica desativado e a resposta da busca informa isso em `providers` e `warnings`.

## Endpoints

### `POST /api/v1/search`

```json
{
  "budget": 2000,
  "origin": "São Paulo",
  "departureDate": "2026-11-12",
  "returnDate": null,
  "nights": null,
  "adults": 1,
  "preferences": ["Praia", "Avião"],
  "limit": 20,
  "sort": "best"
}
```

- `budget`: total da viagem para todos os viajantes, em BRL.
- `origin`: nome do município (qualquer um da lista do front) ou código IATA. Município sem aeroporto usa o aeroporto comercial mais próximo (aviso em `warnings`).
- `preferences`: os rótulos dos botões do `SearchWidget` (`Praia`, `Urbano`, `Natureza`, `Ônibus`, `Avião`, `Pet`), além de `Serra`, `Histórico` e `Internacional`. Sem `Avião` nem `Ônibus`, considera os dois.
- `returnDate` / `nights`: opcionais. Sem nenhum dos dois, usa `limity.search.default-nights` (4).
- `adults`: 1 a 4 (um quarto).
- `sort`: `best` (padrão, melhor hotel primeiro) ou `price` (mais barato primeiro).

Resposta: `options[]` com `destination`, `transport` (`AVIAO`/`ONIBUS`), `flight` ou `bus`, `hotel`, `checkIn`/`checkOut`, `transportCost`, `hotelCost`, `totalCost`, `budgetLeft` e `complete`. Opções com `complete: false` têm só o transporte (hotel sem disponibilidade ou provedor desativado) e vêm depois das completas.

Erros seguem RFC 7807 (`ProblemDetail`): `400` com `errors` por campo, `404` origem não encontrada, `502` falha de provedor.

### Outros

- `GET /api/v1/destinations?tag=praia`: catálogo de destinos.
- `GET /api/v1/origins?term=Reci`: autocomplete de cidades de origem.
- `GET /api/v1/providers`: quais chaves estão preenchidas.
- `GET /api/v1/providers/check`: chamada real de teste em cada provedor.
- `GET /actuator/health`

## Como a busca funciona

1. Resolve a origem (IATA, cidade com aeroporto, ou município → aeroporto mais próximo).
2. Filtra os destinos do catálogo (`catalog/DestinationCatalog.java`) pelas tags pedidas. **Nenhuma API gratuita classifica "praia" ou "serra"**, então o catálogo é curado por nós: para adicionar destinos, basta incluir uma linha lá.
3. Voo: consulta o cache do Aviasales (mês da data pedida, com tolerância de ±3 dias) e escolhe o mais barato; informa se a data bateu (`EXACT`) ou ficou próxima (`NEAR`).
4. Ônibus: estimativa (distância em linha reta × 1,25 × R$ 0,25/km × 2 trechos). Configurável em `application.yml` (`limity.search.bus`). Marcado como `estimated: true`.
5. Para os 12 destinos mais baratos de chegar (`max-hotel-lookups`), busca o hotel mais barato com disponibilidade.
6. Mantém só o que cabe no orçamento e ordena.

Cache em memória (Caffeine): voos 3 h, hotéis 30 min, cidades 7 dias, fotos 7 dias. Chamadas externas têm timeout e limite de concorrência para respeitar as cotas do plano grátis.

## O que ainda não existe

- **Pet**: nenhuma das APIs gratuitas informa se o hotel aceita animais; o filtro é aceito mas a resposta avisa que não foi aplicado.
- **Ônibus com preço real**: ClickBus e Buser só oferecem programa de afiliados, sem API aberta.
- **Voo em tempo real**: a busca ao vivo do Travelpayouts exige 50 mil usuários ativos por mês.
- Login, perfil e planos Premium (as telas do front ainda não têm API aqui).
- Persistência: o protótipo não usa banco; tudo é cache em memória.

## Estrutura

```
com.limity.back
├── search/    SearchController, SearchService, SearchRequest/Response, Preferences
├── catalog/   Destination, Tag, DestinationCatalog, CatalogController
├── origin/    OriginResolver, PlacesClient, GeocodingClient
├── flight/    TravelpayoutsFlightClient, FlightSelector
├── hotel/     LiteApiHotelClient
├── bus/       BusEstimator
├── image/     PexelsImageClient
├── provider/  ProvidersController (status e check das chaves)
├── config/    LimityProperties, AppConfig (cache, CORS, executor)
└── web/       ApiExceptionHandler
```

Voos e hotéis ficam atrás de interfaces (`FlightProvider`, `HotelProvider`), então dá para trocar a fonte (Kayak, Duffel, Moblix...) sem mexer na lógica de busca. Usar duas fontes ao mesmo tempo exigiria um provedor composto, que ainda não existe.
