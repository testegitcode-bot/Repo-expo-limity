package com.limity.back;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import jakarta.servlet.Filter;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

@SpringBootTest
class AuthIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    @Qualifier("springSecurityFilterChain")
    private Filter springSecurityFilterChain;

    private MockMvc mvc() {
        return MockMvcBuilders.webAppContextSetup(context).addFilters(springSecurityFilterChain).build();
    }

    @Test
    void registersLogsInAndReadsCurrentUserWithJwt() throws Exception {
        MvcResult registration = mvc().perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Marina Pereira\",\"email\":\"marina@example.com\",\"password\":\"senha-segura\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.accessToken").isString())
                .andExpect(jsonPath("$.user.email").value("marina@example.com"))
                .andReturn();

        String token = com.jayway.jsonpath.JsonPath.read(registration.getResponse().getContentAsString(), "$.accessToken");

        mvc().perform(get("/api/v1/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Marina Pereira"));

        mvc().perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"MARINA@EXAMPLE.COM\",\"password\":\"senha-segura\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void rejectsProtectedEndpointWithoutToken() throws Exception {
        mvc().perform(get("/api/v1/auth/me"))
                .andExpect(status().isForbidden());
    }

    @Test
    void rejectsInvalidCredentials() throws Exception {
        mvc().perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"missing@example.com\",\"password\":\"wrong-password\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void savesTravelPreferencesForCurrentUser() throws Exception {
        MvcResult registration = mvc().perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"João Silva\",\"email\":\"joao-prefs@example.com\",\"password\":\"senha-segura\"}"))
                .andExpect(status().isCreated())
                .andReturn();

        String token = com.jayway.jsonpath.JsonPath.read(registration.getResponse().getContentAsString(), "$.accessToken");

        mvc().perform(put("/api/v1/auth/me/preferences")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"preferences\":[\"Praia\",\"Natureza\",\"Ignorada\"]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preferences[0]").value("Praia"))
                .andExpect(jsonPath("$.preferences[1]").value("Natureza"))
                .andExpect(jsonPath("$.spentAmount").value(0));
    }

    @Test
    void updatesAndDeletesCurrentUser() throws Exception {
        MvcResult registration = mvc().perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Carla Lima\",\"email\":\"carla-edit@example.com\",\"password\":\"senha-segura\"}"))
                .andExpect(status().isCreated())
                .andReturn();

        String token = com.jayway.jsonpath.JsonPath.read(registration.getResponse().getContentAsString(), "$.accessToken");

        mvc().perform(put("/api/v1/auth/me")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Carla Souza\",\"email\":\"carla-nova@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Carla Souza"))
                .andExpect(jsonPath("$.email").value("carla-nova@example.com"));

        mvc().perform(options("/api/v1/auth/me/preferences")
                        .header("Origin", "http://localhost:3000")
                        .header("Access-Control-Request-Method", "PUT")
                        .header("Access-Control-Request-Headers", "authorization,content-type"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));

        mvc().perform(delete("/api/v1/auth/me").header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());

        mvc().perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"carla-nova@example.com\",\"password\":\"senha-segura\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void resetsPasswordWithRecoveryToken() throws Exception {
        mvc().perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Ana Souza\",\"email\":\"ana-reset@example.com\",\"password\":\"senha-antiga\"}"))
                .andExpect(status().isCreated());

        MvcResult forgot = mvc().perform(post("/api/v1/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"ANA-RESET@example.com\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resetToken").isString())
                .andReturn();

        String resetToken = com.jayway.jsonpath.JsonPath.read(forgot.getResponse().getContentAsString(), "$.resetToken");

        mvc().perform(post("/api/v1/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"token\":\"" + resetToken + "\",\"password\":\"senha-nova-1\"}"))
                .andExpect(status().isOk());

        mvc().perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"ana-reset@example.com\",\"password\":\"senha-nova-1\"}"))
                .andExpect(status().isOk());
    }
}
