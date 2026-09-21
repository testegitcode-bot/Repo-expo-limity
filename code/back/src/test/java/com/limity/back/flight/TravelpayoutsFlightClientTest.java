package com.limity.back.flight;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.queryParam;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.hamcrest.Matchers.startsWith;

import java.time.Duration;
import java.time.YearMonth;
import java.util.List;

import com.limity.back.common.ProviderException;
import com.limity.back.config.LimityProperties;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class TravelpayoutsFlightClientTest {

    private static LimityProperties.Travelpayouts props(String token) {
        return new LimityProperties.Travelpayouts(token, "meu-marker", "https://api.test", "https://places.test",
                "https://www.aviasales.com", "br", Duration.ofSeconds(5), 2);
    }

    private record Fixture(TravelpayoutsFlightClient client, MockRestServiceServer server) {
        static Fixture of(String token) {
            RestClient.Builder builder = RestClient.builder().baseUrl("https://api.test");
            MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
            return new Fixture(new TravelpayoutsFlightClient(builder.build(), props(token)), server);
        }
    }

    @Test
    void parsesRoundTripsAndBuildsAffiliateLink() {
        Fixture f = Fixture.of("tok-123");
        f.server().expect(requestTo(startsWith("https://api.test/aviasales/v3/prices_for_dates")))
                .andExpect(header("X-Access-Token", "tok-123"))
                .andExpect(queryParam("origin", "SAO"))
                .andExpect(queryParam("destination", "REC"))
                .andExpect(queryParam("departure_at", "2026-11"))
                .andExpect(queryParam("currency", "brl"))
                .andRespond(withSuccess("""
                        {"success":true,"currency":"brl","data":[
                          {"origin":"SAO","destination":"REC","price":890,"airline":"G3","flight_number":"1234",
                           "departure_at":"2026-11-12T08:35:00-03:00","return_at":"2026-11-16T18:00:00-03:00",
                           "transfers":0,"link":"/search/SAO1211REC16111?t=abc"},
                          {"origin":"SAO","destination":"REC","price":500,"departure_at":"2026-11-13T08:35:00-03:00"}
                        ]}""", MediaType.APPLICATION_JSON));

        List<FlightQuote> quotes = f.client().roundTrips("SAO", "REC", YearMonth.of(2026, 11));

        assertThat(quotes).hasSize(1); // o item sem volta é descartado
        FlightQuote quote = quotes.get(0);
        assertThat(quote.price()).isEqualByComparingTo("890");
        assertThat(quote.departureDate().toString()).isEqualTo("2026-11-12");
        assertThat(quote.returnDate().toString()).isEqualTo("2026-11-16");
        assertThat(quote.bookingUrl()).isEqualTo("https://www.aviasales.com/search/SAO1211REC16111?t=abc&marker=meu-marker");
        f.server().verify();
    }

    @Test
    void emptyDataMeansNoQuotes() {
        Fixture f = Fixture.of("tok");
        f.server().expect(requestTo(startsWith("https://api.test/aviasales/v3/prices_for_dates")))
                .andRespond(withSuccess("{\"success\":true,\"data\":[],\"currency\":\"brl\"}", MediaType.APPLICATION_JSON));

        assertThat(f.client().roundTrips("SAO", "REC", YearMonth.of(2026, 11))).isEmpty();
    }

    @Test
    void invalidTokenBecomesProviderException() {
        Fixture f = Fixture.of("ruim");
        f.server().expect(requestTo(startsWith("https://api.test/aviasales/v3/prices_for_dates")))
                .andRespond(withStatus(HttpStatus.UNAUTHORIZED));

        assertThatThrownBy(() -> f.client().roundTrips("SAO", "REC", YearMonth.of(2026, 11)))
                .isInstanceOf(ProviderException.class)
                .hasMessageContaining(".env")
                .extracting(e -> ((ProviderException) e).httpStatus()).isEqualTo(401);
    }

    @Test
    void refusesToCallWithoutToken() {
        Fixture f = Fixture.of("");

        assertThat(f.client().enabled()).isFalse();
        assertThatThrownBy(() -> f.client().roundTrips("SAO", "REC", YearMonth.of(2026, 11)))
                .isInstanceOf(ProviderException.class);
    }
}
