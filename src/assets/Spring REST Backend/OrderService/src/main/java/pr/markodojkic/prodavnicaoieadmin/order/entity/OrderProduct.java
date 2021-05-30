package pr.markodojkic.prodavnicaoieadmin.order.entity;

import pr.markodojkic.prodavnicaoieadmin.order.model.OrderProductCompositePK;

import javax.persistence.*;

@Entity
@Table(name = "orders_product")
@IdClass(OrderProductCompositePK.class)
public class OrderProduct {
    @Id
    private int order_id;
    @Id
    private int product_id;
    @Column(name = "quantaty")
    private int quantaty;

    public OrderProduct() { }

    public OrderProduct(int order_id, int product_id, int quantaty) {
        this.order_id = order_id;
        this.product_id = product_id;
        this.quantaty = quantaty;
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

    public int getQuantaty() {
        return quantaty;
    }

    public void setQuantaty(int quantaty) {
        this.quantaty = quantaty;
    }
}
