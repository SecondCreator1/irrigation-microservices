package tn.itbs.project.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String CHANGEMENT_QUEUE = "meteo.changement.conditions.queue";

    @Bean
    public Queue meteoChangementQueue() {
        return new Queue(CHANGEMENT_QUEUE, true);
    }
}
