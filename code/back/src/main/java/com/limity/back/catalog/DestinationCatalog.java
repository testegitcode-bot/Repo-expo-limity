package com.limity.back.catalog;

import static com.limity.back.catalog.Tag.HISTORICO;
import static com.limity.back.catalog.Tag.INTERNACIONAL;
import static com.limity.back.catalog.Tag.NATUREZA;
import static com.limity.back.catalog.Tag.PRAIA;
import static com.limity.back.catalog.Tag.SERRA;
import static com.limity.back.catalog.Tag.URBANO;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class DestinationCatalog {

    private static final List<Destination> DESTINATIONS = List.of(
            // Praias
            br("porto-de-galinhas", "Porto de Galinhas", "PE", "REC", "Recife (REC)", -8.5074, -35.0027, PRAIA),
            br("maragogi", "Maragogi", "AL", "MCZ", "Maceió (MCZ)", -9.0122, -35.2225, PRAIA),
            br("sao-miguel-dos-milagres", "São Miguel dos Milagres", "AL", "MCZ", "Maceió (MCZ)", -9.2530, -35.3760, PRAIA),
            br("buzios", "Búzios", "RJ", "CFB", "Cabo Frio (CFB)", -22.7469, -41.8817, PRAIA),
            br("ilha-grande", "Ilha Grande", "RJ", "RIO", "Rio de Janeiro (RIO)", -23.1370, -44.1710, PRAIA, NATUREZA),
            br("paraty", "Paraty", "RJ", "RIO", "Rio de Janeiro (RIO)", -23.2178, -44.7131, PRAIA, HISTORICO),
            br("fortaleza", "Fortaleza", "CE", "FOR", null, -3.7319, -38.5267, PRAIA, URBANO),
            br("jericoacoara", "Jericoacoara", "CE", "JJD", null, -2.7975, -40.5140, PRAIA, NATUREZA),
            br("canoa-quebrada", "Canoa Quebrada", "CE", "FOR", "Fortaleza (FOR)", -4.5290, -37.7050, PRAIA),
            br("natal", "Natal", "RN", "NAT", null, -5.7945, -35.2110, PRAIA, URBANO),
            br("pipa", "Pipa", "RN", "NAT", "Natal (NAT)", -6.2280, -35.0470, PRAIA),
            br("maceio", "Maceió", "AL", "MCZ", null, -9.6658, -35.7353, PRAIA, URBANO),
            br("joao-pessoa", "João Pessoa", "PB", "JPA", null, -7.1195, -34.8450, PRAIA, URBANO),
            br("aracaju", "Aracaju", "SE", "AJU", null, -10.9472, -37.0731, PRAIA, URBANO),
            br("porto-seguro", "Porto Seguro", "BA", "BPS", null, -16.4435, -39.0643, PRAIA),
            br("trancoso", "Trancoso", "BA", "BPS", "Porto Seguro (BPS)", -16.5910, -39.0960, PRAIA),
            br("arraial-dajuda", "Arraial d'Ajuda", "BA", "BPS", "Porto Seguro (BPS)", -16.4880, -39.0790, PRAIA),
            br("morro-de-sao-paulo", "Morro de São Paulo", "BA", "SSA", "Salvador (SSA)", -13.3800, -38.9160, PRAIA),
            br("florianopolis", "Florianópolis", "SC", "FLN", null, -27.5954, -48.5480, PRAIA, NATUREZA, URBANO),
            br("balneario-camboriu", "Balneário Camboriú", "SC", "NVT", "Navegantes (NVT)", -26.9906, -48.6347, PRAIA, URBANO),
            br("fernando-de-noronha", "Fernando de Noronha", "PE", "FEN", null, -3.8547, -32.4240, PRAIA, NATUREZA),
            br("barreirinhas", "Lençóis Maranhenses", "MA", "SLZ", "São Luís (SLZ)", -2.7580, -42.8240, PRAIA, NATUREZA),
            br("alter-do-chao", "Alter do Chão", "PA", "STM", "Santarém (STM)", -2.5000, -54.9500, PRAIA, NATUREZA),

            // Cidades grandes / históricas
            br("rio-de-janeiro", "Rio de Janeiro", "RJ", "RIO", null, -22.9068, -43.1729, URBANO, PRAIA),
            br("sao-paulo", "São Paulo", "SP", "SAO", null, -23.5505, -46.6333, URBANO),
            br("salvador", "Salvador", "BA", "SSA", null, -12.9777, -38.5016, HISTORICO, URBANO, PRAIA),
            br("recife", "Recife", "PE", "REC", null, -8.0476, -34.8770, URBANO, PRAIA),
            br("belo-horizonte", "Belo Horizonte", "MG", "BHZ", null, -19.9167, -43.9345, URBANO),
            br("curitiba", "Curitiba", "PR", "CWB", null, -25.4284, -49.2733, URBANO),
            br("brasilia", "Brasília", "DF", "BSB", null, -15.7939, -47.8828, URBANO, HISTORICO),
            br("porto-alegre", "Porto Alegre", "RS", "POA", null, -30.0346, -51.2177, URBANO),
            br("manaus", "Manaus", "AM", "MAO", null, -3.1190, -60.0217, URBANO, NATUREZA),
            br("belem", "Belém", "PA", "BEL", null, -1.4558, -48.4902, URBANO, HISTORICO),
            br("ouro-preto", "Ouro Preto", "MG", "BHZ", "Belo Horizonte (BHZ)", -20.3856, -43.5035, HISTORICO),
            br("tiradentes", "Tiradentes", "MG", "BHZ", "Belo Horizonte (BHZ)", -21.1103, -44.1781, HISTORICO, SERRA),

            // Natureza e serra
            br("foz-do-iguacu", "Foz do Iguaçu", "PR", "IGU", null, -25.5163, -54.5854, NATUREZA),
            br("bonito", "Bonito", "MS", "CGR", "Campo Grande (CGR)", -21.1261, -56.4836, NATUREZA),
            br("chapada-diamantina", "Chapada Diamantina", "BA", "SSA", "Salvador (SSA)", -12.5610, -41.3920, NATUREZA),
            br("gramado", "Gramado", "RS", "POA", "Porto Alegre (POA)", -29.3790, -50.8740, SERRA),
            br("campos-do-jordao", "Campos do Jordão", "SP", "SAO", "São Paulo (SAO)", -22.7390, -45.5910, SERRA),
            br("petropolis", "Petrópolis", "RJ", "RIO", "Rio de Janeiro (RIO)", -22.5112, -43.1779, SERRA, HISTORICO),

            // Internacionais
            intl("lisboa", "Lisboa", "Portugal", "LIS", "PT", 38.7223, -9.1393, URBANO, HISTORICO),
            intl("buenos-aires", "Buenos Aires", "Argentina", "BUE", "AR", -34.6037, -58.3816, URBANO),
            intl("santiago", "Santiago", "Chile", "SCL", "CL", -33.4489, -70.6693, URBANO, SERRA),
            intl("montevideu", "Montevidéu", "Uruguai", "MVD", "UY", -34.9011, -56.1645, URBANO, PRAIA),
            intl("punta-cana", "Punta Cana", "República Dominicana", "PUJ", "DO", 18.5820, -68.4055, PRAIA),
            intl("cancun", "Cancún", "México", "CUN", "MX", 21.1619, -86.8515, PRAIA),
            intl("miami", "Miami", "Estados Unidos", "MIA", "US", 25.7617, -80.1918, URBANO, PRAIA),
            intl("orlando", "Orlando", "Estados Unidos", "ORL", "US", 28.5383, -81.3792, URBANO),
            intl("paris", "Paris", "França", "PAR", "FR", 48.8566, 2.3522, URBANO, HISTORICO),
            intl("maldivas", "Maldivas", "Maldivas", "MLE", "MV", 4.1755, 73.5093, PRAIA));

    public List<Destination> all() {
        return DESTINATIONS;
    }

    public Optional<Destination> find(String id) {
        return DESTINATIONS.stream().filter(destination -> destination.id().equals(id)).findFirst();
    }

    private static Destination br(String id, String name, String state, String iata, String hub,
            double lat, double lon, Tag... tags) {
        return new Destination(id, name, state, iata, hub, "BR", lat, lon, Set.of(tags));
    }

    private static Destination intl(String id, String name, String country, String iata,
            String countryCode, double lat, double lon, Tag... tags) {
        Set<Tag> all = new java.util.HashSet<>(Set.of(tags));
        all.add(INTERNACIONAL);
        return new Destination(id, name, country, iata, null, countryCode, lat, lon, Set.copyOf(all));
    }
}
