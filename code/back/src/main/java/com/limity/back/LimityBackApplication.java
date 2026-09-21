package com.limity.back;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class LimityBackApplication {

	public static void main(String[] args) {
		SpringApplication.run(LimityBackApplication.class, args);
	}

}
