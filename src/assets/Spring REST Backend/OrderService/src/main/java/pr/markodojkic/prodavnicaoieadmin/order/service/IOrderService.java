package pr.markodojkic.prodavnicaoieadmin.order.service;

import pr.markodojkic.prodavnicaoieadmin.order.entity.Order;

import java.util.List;

public interface IOrderService {
    Order addNewOrder(Order newOrder);
    Order updateOrderById(int id, Order newOrderData);
    void deleteOrderById(int id);
    void deleteAllOrdersFromAccount(int account_id);
    void deleteAllOrdersWithShippingMethod(Order.ShippingMethods shippingMethod);
    void deleteAllOrdersWithStatus(Order.Status status);
    Order findOrderById(int id);
    long getTotalNumberOfOrders();
    int getTotalNumberOfOrdersFromAccount(int account_id);
    int getTotalNumberOfOrdersByShippingMethod(Order.ShippingMethods shippingMethod);
    int getTotalNumberOfOrdersByStatus(Order.Status status);
    List<Order> listAllOrders();
    List<Order> listAllOrdersFromAccount(int account_id);
    List<Order> listAllOrdersByShippingMethod(Order.ShippingMethods shippingMethod);
    List<Order> listAllOrdersByStatus(Order.Status status);
}
