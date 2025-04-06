package MonitoringDevice.config;

import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
@Configuration
public class RabbitConfig {

    @Bean
    public Queue MeasurementsQueue() {
        return new Queue("Measurements", false);
    }

    @Bean
    public TopicExchange deviceExchange() {
        return new TopicExchange("device-exchange", true, false);
    }

    @Bean
    public Queue deviceQueue() {
        return new Queue("device-queue", true);
    }

    @Bean
    public Binding bindingDeviceQueue(Queue deviceQueue, TopicExchange deviceExchange) {
        return BindingBuilder.bind(deviceQueue).to(deviceExchange).with("device.change.#");
    }
}
