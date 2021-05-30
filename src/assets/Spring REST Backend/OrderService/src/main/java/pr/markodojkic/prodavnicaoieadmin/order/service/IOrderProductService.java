package pr.markodojkic.prodavnicaoieadmin.order.service;

import pr.markodojkic.prodavnicaoieadmin.order.entity.OrderProduct;
import pr.markodojkic.prodavnicaoieadmin.order.model.OrderProductCompositePK;

import java.util.List;

public interface IOrderProductService {
    OrderProduct addNewOrderProduct(OrderProduct newOrderProduct);
    OrderProduct updateOrderProductById(OrderProductCompositePK id, OrderProduct newOrderProductData);
    void deleteOrderProductById(OrderProductCompositePK id);
    void deleteAllOrderedProductsByOrder(int order_id);
    void deleteAllOrderedProductsByProduct(int product_id);
    OrderProduct findOrderProductById(OrderProductCompositePK id);
    long getTotalNumberOfOrderedProducts();
    int getTotalNumberOfOrderedProductsByOrder(int order_id);
    int getTotalNumberOfOrderedProductsByProduct(int product_id);
    int getSubtotalByOrder(int order_id);
    int getSubtotalByProduct(int product_id);
    List<OrderProduct> listAllOrderProducts();
    List<OrderProduct> listAllOrderProductsByOrder(int order_id);
    List<OrderProduct> listAllOrderProductsByProduct(int product_id);
}
