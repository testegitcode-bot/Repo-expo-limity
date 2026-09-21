package com.limity.back;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
@TestPropertySource(properties = {
        "limity.travelpayouts.token=",
        "limity.liteapi.key=",
        "limity.pexels.key="
})
class ApiIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    private MockMvc mvc() {
        return MockMvcBuilders.webAppContextSetup(context).build();
    }

    @Test
    void invalidSearchReturnsFieldErrorsAsProblemDetail() throws Exception {
        mvc().perform(post("/api/v1/search")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"budget\":0,\"origin\":\"\",\"adults\":9}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.budget").exists())
                .andExpect(jsonPath("$.errors.origin").exists())
                .andExpect(jsonPath("$.errors.departureDate").exists())
                .andExpect(jsonPath("$.errors.adults").exists());
    }

    @Test
    void destinationsCanBeFilteredByTag() throws Exception {
        mvc().perform(get("/api/v1/destinations").param("tag", "praia"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].tags").isArray());
    }

    @Test
    void providersEndpointNeverLeaksKeys() throws Exception {
        mvc().perform(get("/api/v1/providers"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.travelpayouts").value(false))
                .andExpect(jsonPath("$.liteapi").value(false))
                .andExpect(jsonPath("$.pexels").value(false));
    }
}
