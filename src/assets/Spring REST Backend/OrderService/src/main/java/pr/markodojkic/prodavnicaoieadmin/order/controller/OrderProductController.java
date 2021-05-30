package pr.markodojkic.prodavnicaoieadmin.order.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.markodojkic.prodavnicaoieadmin.order.entity.OrderProduct;
import pr.markodojkic.prodavnicaoieadmin.order.model.OrderProductCompositePK;
import pr.markodojkic.prodavnicaoieadmin.order.service.OrderProductService;

import java.util.List;

@RestController
@RequestMapping("/api/prodavnicaoieadmin/orderProduct")
public class OrderProductController {
    @Autowired
    private OrderProductService orderProductService;

    @PostMapping("insert")
    @CrossOrigin("*")
    public OrderProduct addNewOrderProduct(@RequestBody OrderProduct newOrderProduct){
        return this.orderProductService.addNewOrderProduct(newOrderProduct);
    }

    @RequestMapping(value = "update/{order_id}/{product_id}", method = RequestMethod.PATCH)
    @CrossOrigin("*")
    public OrderProduct updateOrderProductById(@PathVariable int order_id, @PathVariable int product_id, @RequestBody OrderProduct newOrderProductData){
        return this.orderProductService.updateOrderProductById(new OrderProductCompositePK(order_id, product_id), newOrderProductData);
    }

    @RequestMapping(value = "delete/{order_id}/{product_id}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteOrderProductById(@PathVariable int order_id, @PathVariable int product_id){
        this.orderProductService.deleteOrderProductById(new OrderProductCompositePK(order_id, product_id));
    }

    @RequestMapping(value = "deleteAllByOrder/{order_id}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteAllOrderedProductsByOrder(@PathVariable int order_id){
        this.orderProductService.deleteAllOrderedProductsByOrder(order_id);
    }

    @RequestMapping(value = "deleteAllByOrder/{product_id}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteAllOrderedProductsByProduct(@PathVariable int product_id){
        this.orderProductService.deleteAllOrderedProductsByProduct(product_id);
    }

    @RequestMapping(value = "find/{order_id}/{product_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public OrderProduct findOrderProductById(@PathVariable int order_id, @PathVariable int product_id){
        return this.orderProductService.findOrderProductById(new OrderProductCompositePK(order_id, product_id));
    }

    @GetMapping("getTotalNumber")
    @CrossOrigin("*")
    public long getTotalNumberOfOrderedProducts(){
        return this.orderProductService.getTotalNumberOfOrderedProducts();
    }

    @RequestMapping(value = "getTotalNumberByOrder/{order_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getTotalNumberOfOrderedProductsByOrder(@PathVariable int order_id){
        return this.orderProductService.getTotalNumberOfOrderedProductsByOrder(order_id);
    }

    @RequestMapping(value = "getTotalNumberByProduct/{product_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getTotalNumberOfOrderedProductsByProduct(@PathVariable int product_id){
        return this.orderProductService.getTotalNumberOfOrderedProductsByProduct(product_id);
    }

    @RequestMapping(value = "getSubtotalByOrder/{order_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getSubtotalOfOrderedProductsByOrder(@PathVariable int order_id){
      return this.orderProductService.getSubtotalByOrder(order_id);
    }

    @RequestMapping(value = "getSubtotalByProduct/{product_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getSubtotalOfOrderedProductsByProduct(@PathVariable int product_id){
      return this.orderProductService.getSubtotalByProduct(product_id);
    }

    @GetMapping("listAll")
    @CrossOrigin("*")
    public List<OrderProduct> listAllOrderProducts(){
        return this.orderProductService.listAllOrderProducts();
    }

    @RequestMapping(value = "listAllByOrder/{order_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public List<OrderProduct> listAllOrderProductsByOrder(@PathVariable int order_id){
        return this.orderProductService.listAllOrderProductsByOrder(order_id);
    }

    @RequestMapping(value = "listAllByProduct/{product_id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public List<OrderProduct> listAllOrderProductsByProduct(@PathVariable int product_id){
        return this.orderProductService.listAllOrderProductsByProduct(product_id);
    }
}
