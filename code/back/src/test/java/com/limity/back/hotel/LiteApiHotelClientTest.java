package com.limity.back.hotel;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import java.time.Duration;
import java.time.LocalDate;
import java.util.Optional;

import com.limity.back.catalog.Destination;
import com.limity.back.catalog.DestinationCatalog;
import com.limity.back.config.LimityProperties;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class LiteApiHotelClientTest {

    private static final String HOTELS = """
            {"data":[
              {"id":"lp1","name":"Hotel A","address":"Rua 1","stars":4,"rating":8.5,"main_photo":"https://img/a.jpg"},
              {"id":"lp2","name":"Hotel B","address":"Rua 2","stars":3,"rating":7.9,"main_photo":"https://img/b.jpg"}
            ],"total":2}""";

    private final Destination recife = new DestinationCatalog().find("recife").orElseThrow();
    private MockRestServiceServer server;
    private LiteApiHotelClient client;

    @BeforeEach
    void setUp() {
        RestClient.Builder builder = RestClient.builder().baseUrl("https://lite.test");
        server = MockRestServiceServer.bindTo(builder).build();
        client = new LiteApiHotelClient(builder.build(),
                new LimityProperties.LiteApi("sand_key", "https://lite.test", Duration.ofSeconds(5), 2, 30, 15000, 8));
    }

    @Test
    void returnsCheapestBrlRateJoinedWithHotelData() {
        server.expect(requestTo(startsWith("https://lite.test/data/hotels")))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("X-API-Key", "sand_key"))
                .andExpect(queryParam("countryCode", "BR"))
                .andRespond(withSuccess(HOTELS, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://lite.test/hotels/rates"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(header("X-API-Key", "sand_key"))
                .andExpect(jsonPath("$.checkin").value("2026-12-01"))
                .andExpect(jsonPath("$.checkout").value("2026-12-05"))
                .andExpect(jsonPath("$.currency").value("BRL"))
                .andExpect(jsonPath("$.occupancies[0].adults").value(2))
                .andExpect(jsonPath("$.hotelIds[0]").value("lp1"))
                .andRespond(withSuccess("""
                        {"data":[
                          {"hotelId":"lp1","roomTypes":[{"rates":[
                            {"retailRate":{"total":[{"amount":900.50,"currency":"BRL"}]}},
                            {"retailRate":{"total":[{"amount":10,"currency":"USD"}]}}]}]},
                          {"hotelId":"lp2","roomTypes":[{"rates":[
                            {"retailRate":{"total":[{"amount":650,"currency":"BRL"}]}}]}]}
                        ]}""", MediaType.APPLICATION_JSON));

        Optional<HotelStay> stay = client.cheapestStay(recife, LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 5), 2);

        assertThat(stay).isPresent();
        assertThat(stay.get().hotelId()).isEqualTo("lp2");
        assertThat(stay.get().name()).isEqualTo("Hotel B");
        assertThat(stay.get().total()).isEqualByComparingTo("650");
        assertThat(stay.get().photoUrl()).isEqualTo("https://img/b.jpg");
        server.verify();
    }

    @Test
    void noAvailabilityIs404AndReturnsEmpty() {
        server.expect(requestTo(startsWith("https://lite.test/data/hotels")))
                .andRespond(withSuccess(HOTELS, MediaType.APPLICATION_JSON));
        server.expect(requestTo("https://lite.test/hotels/rates"))
                .andRespond(withStatus(HttpStatus.NOT_FOUND));

        assertThat(client.cheapestStay(recife, LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 5), 2)).isEmpty();
    }

    @Test
    void noHotelsNearbyReturnsEmptyWithoutAskingForRates() {
        server.expect(requestTo(startsWith("https://lite.test/data/hotels")))
                .andRespond(withSuccess("{\"data\":[]}", MediaType.APPLICATION_JSON));

        assertThat(client.cheapestStay(recife, LocalDate.of(2026, 12, 1), LocalDate.of(2026, 12, 5), 2)).isEmpty();
        server.verify();
    }
}
