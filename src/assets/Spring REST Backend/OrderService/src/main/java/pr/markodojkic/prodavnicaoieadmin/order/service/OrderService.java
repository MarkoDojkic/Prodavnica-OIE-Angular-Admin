package pr.markodojkic.prodavnicaoieadmin.order.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.markodojkic.prodavnicaoieadmin.order.entity.Order;
import pr.markodojkic.prodavnicaoieadmin.order.repository.IOrderRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService implements IOrderService {
    @Autowired
    private IOrderRepository orderRepository;

    @Override
    public Order addNewOrder(Order newOrder) {
        return this.orderRepository.saveAndFlush(newOrder);
    }

    @Override
    public Order updateOrderById(int id, Order newOrderData) {
        Order order = this.findOrderById(id);
        if(order == null) return null;

        if(newOrderData.getAccount_id() > 0) order.setAccount_id(newOrderData.getAccount_id());
        if(newOrderData.getShippingMethod() != null) order.setShippingMethod(newOrderData.getShippingMethod());
        if(newOrderData.getStatus() != null) order.setStatus(newOrderData.getStatus());

        return this.addNewOrder(order);
    }

    @Override
    public void deleteOrderById(int id) {
        this.orderRepository.deleteById(id);
    }

    @Override
    public void deleteAllOrdersFromAccount(int account_id) {
        this.orderRepository.deleteAll(this.listAllOrdersFromAccount(account_id));
    }

    @Override
    public void deleteAllOrdersWithShippingMethod(Order.ShippingMethods shippingMethod) {
        this.orderRepository.deleteAll(this.listAllOrdersByShippingMethod(shippingMethod));
    }

    @Override
    public void deleteAllOrdersWithStatus(Order.Status status) {
        this.orderRepository.deleteAll(this.listAllOrdersByStatus(status));
    }

    @Override
    public Order findOrderById(int id) {
        return this.orderRepository.findById(id).isPresent()
          ? this.orderRepository.findById(id).get() : null;
    }

    @Override
    public long getTotalNumberOfOrders() {
        return this.orderRepository.count();
    }

    @Override
    public int getTotalNumberOfOrdersFromAccount(int account_id) {
        return this.listAllOrdersFromAccount(account_id).size();
    }

    @Override
    public int getTotalNumberOfOrdersByShippingMethod(Order.ShippingMethods shippingMethod) {
        return this.listAllOrdersByShippingMethod(shippingMethod).size();
    }

    @Override
    public int getTotalNumberOfOrdersByStatus(Order.Status status) {
        return this.listAllOrdersByStatus(status).size();
    }

    @Override
    public List<Order> listAllOrders() {
        return this.orderRepository.findAll();
    }

    @Override
    public List<Order> listAllOrdersFromAccount(int account_id) {
        return this.listAllOrders().stream()
                .filter(order -> order.getAccount_id() == account_id)
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> listAllOrdersByShippingMethod(Order.ShippingMethods shippingMethod) {
        return this.listAllOrders().stream()
                .filter(order -> order.getShippingMethod().equals(shippingMethod))
                .collect(Collectors.toList());
    }

    @Override
    public List<Order> listAllOrdersByStatus(Order.Status status) {
        return this.listAllOrders().stream()
                .filter(order -> order.getStatus().equals(status))
                .collect(Collectors.toList());
    }
}
