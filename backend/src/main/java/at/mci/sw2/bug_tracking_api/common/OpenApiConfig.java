package at.mci.sw2.bug_tracking_api.common;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI bugTrackingOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("Bug Tracking API")
                        .version("v1")
                        .description(
                                "REST API for managing tickets, users, comments, categories, roles, and attachments."))
                .addServersItem(new Server()
                        .url("http://localhost:8080")
                        .description("Local development server"));
    }
}
