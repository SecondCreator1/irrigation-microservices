package tn.itbs.project.configuration;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
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
    public Binding changementBinding(Queue changementQueue, TopicExchange changementExchange) {
        return BindingBuilder
                .bind(changementQueue)
                .to(changementExchange)
                .with(CHANGEMENT_ROUTING_KEY);
    }

    // ✅ AJOUT : Convertir les messages en JSON
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    // ✅ AJOUT : Configurer RabbitTemplate pour envoyer en JSON
    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory,
                                          MessageConverter jsonMessageConverter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(jsonMessageConverter);
        return template;
    }
}
