package pr.markodojkic.prodavnicaoieadmin.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pr.markodojkic.prodavnicaoieadmin.order.entity.OrderProduct;
import pr.markodojkic.prodavnicaoieadmin.order.model.OrderProductCompositePK;

public interface IOrderProductRepository extends JpaRepository<OrderProduct, OrderProductCompositePK> {
  @Query(value = "SELECT SUM(op.quantaty * p.price) totalPrice FROM prodavnicaOIEAngular.orders_product op \n" +
    "INNER JOIN prodavnicaOIEAngular.product p ON op.product_id = p.product_id WHERE op.order_id = ?1", nativeQuery = true)
  int getSubtotalByOrder(int order_id);
  @Query(value = "SELECT SUM(op.quantaty * p.price) totalPrice FROM prodavnicaOIEAngular.orders_product op \n" +
    "INNER JOIN prodavnicaOIEAngular.product p ON op.product_id = p.product_id WHERE op.product_id = ?1", nativeQuery = true)
  int getSubtotalByProduct(int product_id);
}
