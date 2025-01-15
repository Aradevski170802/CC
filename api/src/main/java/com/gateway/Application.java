package com.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import com.gateway.filter.JwtGatewayFilter;

import java.net.URI;
import java.util.concurrent.atomic.AtomicInteger;

@SpringBootApplication
public class Application {

    private final AtomicInteger requestCounter = new AtomicInteger(0); // Counter for round-robin routing

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("slots-route", r -> r.path("/slots/**")
                        .filters(f -> f
                                .filter(new JwtGatewayFilter()) // Apply JWT filter
                                .filter((exchange, chain) -> {
                                    // Determine the target URI based on request count
                                    int count = requestCounter.incrementAndGet();
                                    String targetUri = (count % 2 == 0)
                                            ? "http://localhost:8080"
                                            : "http://localhost:8082";
                                    exchange.getAttributes().put("targetUri", targetUri);

                                    // Rewrite the request URI to the selected target
                                    exchange.getRequest().mutate()
                                            .uri(URI.create(targetUri + exchange.getRequest().getPath().value()))
                                            .build();

                                    return chain.filter(exchange);
                                }))
                        .uri("lb://noop")) // Placeholder URI
                .build();
    }
}
