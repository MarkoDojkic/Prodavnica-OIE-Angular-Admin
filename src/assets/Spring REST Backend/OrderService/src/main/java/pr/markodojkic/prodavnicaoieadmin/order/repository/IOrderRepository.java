package pr.markodojkic.prodavnicaoieadmin.order.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pr.markodojkic.prodavnicaoieadmin.order.entity.Order;

public interface IOrderRepository extends JpaRepository<Order, Integer> {
}
