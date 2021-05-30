package pr.markodojkic.prodavnicaoieadmin.order.model;

import pr.markodojkic.prodavnicaoieadmin.order.entity.Order;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.stream.Stream;

//https://www.baeldung.com/jpa-persisting-enums-in-jpa
@Converter(autoApply = true)
public class ShippingMethodsConveter implements AttributeConverter<Order.ShippingMethods, String> {
    @Override
    public String convertToDatabaseColumn(Order.ShippingMethods shippingMethod) {
        return shippingMethod == null ? null : shippingMethod.getDatabaseName();
    }

    @Override
    public Order.ShippingMethods convertToEntityAttribute(String s) {
        return s == null || s.isEmpty() ? null
                : Stream.of(Order.ShippingMethods.values())
                .filter(st -> st.getDatabaseName().equals(s))
                .findFirst().get();
    }
}
