package tn.itbs.project.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String CHANGEMENT_QUEUE = "meteo.changement.conditions.queue";
    public static final String CHANGEMENT_EXCHANGE = "meteo.exchange";
    public static final String CHANGEMENT_ROUTING_KEY = "meteo.changement.conditions";

    @Bean
    public Queue changementQueue() {
        return new Queue(CHANGEMENT_QUEUE, true);
    }

    @Bean
    public TopicExchange changementExchange() {
        return new TopicExchange(CHANGEMENT_EXCHANGE, true, false);
    }

    @Bean
    Binding changementBinding(Queue changementQueue, TopicExchange changementExchange) {
        return BindingBuilder.bind(changementQueue)
                .to(changementExchange)
                .with(CHANGEMENT_ROUTING_KEY);
    }
}
