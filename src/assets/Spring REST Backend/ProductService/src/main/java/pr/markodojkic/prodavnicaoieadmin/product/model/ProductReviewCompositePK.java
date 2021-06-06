package pr.markodojkic.prodavnicaoieadmin.product.model;

import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class ProductReviewCompositePK implements Serializable {
    private int product_id, account_id;

    public ProductReviewCompositePK() { }

    public ProductReviewCompositePK(int product_id, int account_id) {
        this.product_id = product_id;
        this.account_id = account_id;
    }

    public int getProduct_id() {
        return product_id;
    }

    public void setProduct_id(int product_id) {
        this.product_id = product_id;
    }

    public int getAccount_id() {
        return account_id;
    }

    public void setAccount_id(int account_id) {
        this.account_id = account_id;
    }
}
