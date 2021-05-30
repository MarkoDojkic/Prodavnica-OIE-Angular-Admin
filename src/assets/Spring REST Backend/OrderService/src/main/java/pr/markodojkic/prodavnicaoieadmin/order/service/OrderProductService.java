package pr.markodojkic.prodavnicaoieadmin.order.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.markodojkic.prodavnicaoieadmin.order.entity.OrderProduct;
import pr.markodojkic.prodavnicaoieadmin.order.model.OrderProductCompositePK;
import pr.markodojkic.prodavnicaoieadmin.order.repository.IOrderProductRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderProductService implements IOrderProductService {
    @Autowired
    private IOrderProductRepository orderProductRepository;

    @Override
    public OrderProduct addNewOrderProduct(OrderProduct newOrderProduct) {
        return this.orderProductRepository.saveAndFlush(newOrderProduct);
    }

    @Override
    public OrderProduct updateOrderProductById(OrderProductCompositePK id, OrderProduct newOrderProductData) {
        OrderProduct orderProduct = this.findOrderProductById(id);
        if(orderProduct == null) return null;

        /* Order and Product ids are part of composite key as JPA primary keys and thus cannot be altered, although database permits that
        if(newOrderProductData.getOrder_id() > 0) orderProduct.setOrder_id(newOrderProductData.getOrder_id());
        if(newOrderProductData.getProduct_id() > 0) orderProduct.setProduct_id(newOrderProductData.getProduct_id());*/
        if(newOrderProductData.getQuantaty() > 0) orderProduct.setQuantaty(newOrderProductData.getQuantaty());

        return this.addNewOrderProduct(orderProduct);
    }

    @Override
    public void deleteOrderProductById(OrderProductCompositePK id) {
        this.orderProductRepository.deleteById(id);
    }

    @Override
    public void deleteAllOrderedProductsByOrder(int order_id) {
        this.orderProductRepository.deleteAll(this.listAllOrderProductsByOrder(order_id));
    }

    @Override
    public void deleteAllOrderedProductsByProduct(int product_id) {
        this.orderProductRepository.deleteAll(this.listAllOrderProductsByProduct(product_id));
    }

    @Override
    public OrderProduct findOrderProductById(OrderProductCompositePK id) {
        return this.orderProductRepository.findById(id).isPresent()
          ? this.orderProductRepository.findById(id).get() : null;
    }

    @Override
    public long getTotalNumberOfOrderedProducts() {
        return this.orderProductRepository.count();
    }

    @Override
    public int getTotalNumberOfOrderedProductsByOrder(int order_id) {
        return this.listAllOrderProductsByOrder(order_id).size();
    }

    @Override
    public int getTotalNumberOfOrderedProductsByProduct(int product_id) {
        return this.listAllOrderProductsByProduct(product_id).size();
    }

  @Override
  public int getSubtotalByOrder(int order_id) {
    return this.orderProductRepository.getSubtotalByOrder(order_id);
  }

  @Override
  public int getSubtotalByProduct(int product_id) {
    return this.orderProductRepository.getSubtotalByProduct(product_id);
  }

  @Override
    public List<OrderProduct> listAllOrderProducts() {
        return this.orderProductRepository.findAll();
    }

    @Override
    public List<OrderProduct> listAllOrderProductsByOrder(int order_id) {
        return this.listAllOrderProducts().stream()
                .filter(o -> o.getOrder_id() == order_id)
                .collect(Collectors.toList());
    }

    @Override
    public List<OrderProduct> listAllOrderProductsByProduct(int product_id) {
        return this.listAllOrderProducts().stream()
                .filter(o -> o.getProduct_id() == product_id)
                .collect(Collectors.toList());
    }
}
