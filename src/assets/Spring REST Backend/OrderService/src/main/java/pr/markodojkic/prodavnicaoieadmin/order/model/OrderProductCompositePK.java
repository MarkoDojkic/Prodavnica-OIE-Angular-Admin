package pr.markodojkic.prodavnicaoieadmin.order.model;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class OrderProductCompositePK implements Serializable {
    private int order_id, product_id;

    public OrderProductCompositePK() { }

    public OrderProductCompositePK(int order_id, int product_id) {
        this.order_id = order_id;
        this.product_id = product_id;
    }

    public int getOrder_id() {
        return order_id;
    }

    public void setOrder_id(int order_id) {
        this.order_id = order_id;
    }

    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }
}