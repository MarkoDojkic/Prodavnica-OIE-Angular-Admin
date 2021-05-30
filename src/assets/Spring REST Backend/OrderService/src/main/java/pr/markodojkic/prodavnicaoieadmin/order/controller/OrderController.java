package pr.markodojkic.prodavnicaoieadmin.order.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.markodojkic.prodavnicaoieadmin.order.entity.Order;
import pr.markodojkic.prodavnicaoieadmin.order.service.OrderService;

import java.util.List;

@RestController()
@RequestMapping("api/prodavnicaoieadmin/order")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @PostMapping("insert")
    @CrossOrigin("*")
    public Order addNewOrder(@RequestBody Order newOrder) {
        return this.orderService.addNewOrder(newOrder);
    }

    @RequestMapping(value = "update/{id}", method = RequestMethod.PATCH)
    @CrossOrigin("*")
    public Order updateOrder(@PathVariable int id, @RequestBody Order newOrderData) {
        return this.orderService.updateOrderById(id, newOrderData);
    }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteOrder(@PathVariable int id) {
        this.orderService.deleteOrderById(id);
    }

    @RequestMapping(value = "deleteAllFromAccount/{account_id}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteAllOrdersFromAccount(@PathVariable int account_id) {
        this.orderService.deleteAllOrdersFromAccount(account_id);
    }

    @RequestMapping(value = "deleteAllWithShippingMethod/{shippingMethod}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteAllOrdersWithShippingMethod(Order.ShippingMethods shippingMethod) {
        this.orderService.deleteAllOrdersWithShippingMethod(shippingMethod);
    }

    @RequestMapping(value = "deleteAllWithStatus/{status}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteAllOrdersWithStatus(@PathVariable Order.Status status) {
        this.orderService.deleteAllOrdersWithStatus(status);
    }

    @RequestMapping(value = "find/{id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public Order findOrder(@PathVariable int id) {
        return this.orderService.findOrderById(id);
    }

    @GetMapping("getTotalNumber")
    @CrossOrigin("*")
    public long getTotalNumberOfOrders() {
        return this.orderService.getTotalNumberOfOrders();
    }

    @RequestMapping(value = "getTotalNumberFromAccount/{account_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getTotalNumberOfOrdersFromAccount(@PathVariable int account_id) {
        return this.orderService.getTotalNumberOfOrdersFromAccount(account_id);
    }

    @RequestMapping(value = "getTotalNumberWithShippingMethod/{shippingMethod}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getTotalNumberOfOrdersByShippingMethod(@PathVariable Order.ShippingMethods shippingMethod) {
        return this.orderService.getTotalNumberOfOrdersByShippingMethod(shippingMethod);
    }

    @RequestMapping(value = "getTotalNumberWithStatus/{status}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getTotalNumberOfOrdersByStatus(@PathVariable Order.Status status) {
        return this.orderService.getTotalNumberOfOrdersByStatus(status);
    }

    @GetMapping("listAll")
    @CrossOrigin("*")
    public List<Order> listAllOrders() {
        return this.orderService.listAllOrders();
    }

    @RequestMapping(value = "listAllFromAccount/{account_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public List<Order> listAllOrdersFromAccount(@PathVariable int account_id) {
        return this.orderService.listAllOrdersFromAccount(account_id);
    }

    @RequestMapping(value = "listAllWithShippingMethod/{shippingMethod}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public List<Order> listAllOrdersByShippingMethod(@PathVariable Order.ShippingMethods shippingMethod) {
        return this.orderService.listAllOrdersByShippingMethod(shippingMethod);
    }

    @RequestMapping(value = "listAllWithStatus/{status}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public List<Order> listAllOrdersByStatus(@PathVariable Order.Status status) {
        return this.orderService.listAllOrdersByStatus(status);
    }
}
