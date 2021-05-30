package pr.markodojkic.prodavnicaoieadmin.product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.markodojkic.prodavnicaoieadmin.product.entity.ProductReview;
import pr.markodojkic.prodavnicaoieadmin.product.model.ProductReviewCompositePK;
import pr.markodojkic.prodavnicaoieadmin.product.service.ProductReviewService;

import java.util.List;

@RestController()
@RequestMapping("api/prodavnicaoieadmin/productReview")
public class ProductReviewController {
    @Autowired
    private ProductReviewService productReviewService;

    @PostMapping("insert")
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public ProductReview addNewProductReview(@RequestBody ProductReview newProductReview){
        return this.productReviewService.addNewProductReview(newProductReview);
    }
    @RequestMapping(value = "update/{product_id}/{account_id}", method = RequestMethod.PATCH)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public ProductReview updateProductReviewById(@PathVariable int product_id, @PathVariable int account_id, @RequestBody ProductReview newProductReviewData, @RequestParam boolean isNegativeReview){
        return this.productReviewService.updateProductReviewById(new ProductReviewCompositePK(product_id, account_id), newProductReviewData, isNegativeReview);
    }

    @RequestMapping(value = "delete/{product_id}/{account_id}", method = RequestMethod.DELETE)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public void deleteProductReviewById(@PathVariable int product_id, @PathVariable int account_id){
        this.productReviewService.deleteProductReviewById(new ProductReviewCompositePK(product_id, account_id));
    }

    @RequestMapping(value = "deleteAllByAccount/{account_id}", method = RequestMethod.DELETE)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public void deleteAllProductReviewsByAccount(@PathVariable int account_id){
        this.productReviewService.deleteAllProductReviewsByAccount(account_id);
    }

    @RequestMapping(value = "deleteAllByProduct/{product_id}", method = RequestMethod.DELETE)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public void deleteAllProductReviewsByProduct(@PathVariable int product_id){
        this.productReviewService.deleteAllProductReviewsByProduct(product_id);
    }

    @RequestMapping(value = "find/{product_id}/{account_id}", method = RequestMethod.GET)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public ProductReview findProductReviewById(@PathVariable int product_id, @PathVariable int account_id){
        return this.productReviewService.findProductReviewById(new ProductReviewCompositePK(product_id, account_id));
    }

    @GetMapping("getTotalNumber")
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public long getTotalNumberOfProductReviews(){
        return this.productReviewService.getTotalNumberOfProductReviews();
    }

    @RequestMapping(value = "getTotalNumberByAccount/{account_id}", method = RequestMethod.GET)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public int getTotalNumberOfProductReviewsByAccount(@PathVariable int account_id){
        return this.productReviewService.getTotalNumberOfProductReviewsByAccount(account_id);
    }

    @RequestMapping(value = "getTotalNumberByProduct/{product_id}", method = RequestMethod.GET)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public int getTotalNumberOfProductReviewsByProduct(@PathVariable int product_id){
        return this.productReviewService.getTotalNumberOfProductReviewsByProduct(product_id);
    }

    @GetMapping("listAll")
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public List<ProductReview> listAllProductReviews(){
        return this.productReviewService.listAllProductReviews();
    }

    @RequestMapping(value = "listAllByAccount/{account_id}", method = RequestMethod.GET)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public List<ProductReview> listAllProductReviewsByAccount(@PathVariable int account_id){
        return this.productReviewService.listAllProductReviewsByAccount(account_id);
    }

    @RequestMapping(value = "listAllByProduct/{product_id}", method = RequestMethod.GET)
    @CrossOrigin(origins = {"http://localhost:51680", "https://localhost:51680"})
    public List<ProductReview> listAllProductReviewsByProduct(@PathVariable int product_id){
        return this.productReviewService.listAllProductReviewsByProduct(product_id);
    }
}