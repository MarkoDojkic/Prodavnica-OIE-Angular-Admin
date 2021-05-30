package pr.markodojkic.prodavnicaoieadmin.order.model;

import pr.markodojkic.prodavnicaoieadmin.order.entity.Order;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.stream.Stream;

//https://www.baeldung.com/jpa-persisting-enums-in-jpa
@Converter(autoApply = true)
public class StatusConverter implements AttributeConverter<Order.Status, String> {
    @Override
    public String convertToDatabaseColumn(Order.Status status) {
        return status == null ? null : status.getDatabaseName();
    }

    @Override
    public Order.Status convertToEntityAttribute(String s) {
        return s == null || s.isEmpty() ? null
                                        : Stream.of(Order.Status.values())
                                                .filter(st -> st.getDatabaseName().equals(s))
                                                .findFirst().get();
    }
}