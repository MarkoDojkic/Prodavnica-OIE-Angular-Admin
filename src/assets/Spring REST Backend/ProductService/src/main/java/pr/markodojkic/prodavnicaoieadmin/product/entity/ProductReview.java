package pr.markodojkic.prodavnicaoieadmin.product.entity;

import pr.markodojkic.prodavnicaoieadmin.product.model.ProductReviewCompositePK;

import javax.persistence.*;

@Entity
@Table(name="product_review")
@IdClass(ProductReviewCompositePK.class)
public class ProductReview {
    @Id
    private int product_id;
    @Id
    private int account_id;
    @Column(name = "comment")
    private String comment;
    @Column(name = "review")
    private int review;

    public ProductReview() { }

    public ProductReview(int product_id, int account_id, String comment, int review) {
        this.product_id = product_id;
        this.account_id = account_id;
        this.comment = comment;
        this.review = review;
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

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public int getReview() {
        return review;
    }

    public void setReview(int review) {
        this.review = review;
    }
}
