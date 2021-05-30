package pr.markodojkic.prodavnicaoieadmin.product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.markodojkic.prodavnicaoieadmin.product.entity.Product;
import pr.markodojkic.prodavnicaoieadmin.product.service.ProductService;

import java.util.List;

@RestController()
@RequestMapping("api/prodavnicaoieadmin/product")
public class ProductController {
    @Autowired
    private ProductService productService;

        @PostMapping("insert")
        @CrossOrigin("*")
        public Product addNewProduct(@RequestBody Product newProduct){
            return this.productService.addNewProduct(newProduct);
        }

        @RequestMapping(value = "update/{id}", method = RequestMethod.PATCH)
        @CrossOrigin("*")
        public Product updateProduct(@PathVariable int id, @RequestBody Product newProductData, @RequestParam boolean isFree, @RequestParam boolean isOutOfStock){
            return this.productService.updateProductById(id, newProductData, isFree, isOutOfStock);
        }

    @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteProduct(@PathVariable int id) {
        this.productService.deleteProductById(id);
    }

    @RequestMapping(value = "deleteAllWithinCategory/{id}", method = RequestMethod.DELETE)
    @CrossOrigin("*")
    public void deleteAllWithinCategory(@PathVariable int id) {
        this.productService.deleteAllProductsWithinCategory(id);
    }

    @RequestMapping(value = "find/{id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public Product findProduct(@PathVariable int id){
        return this.productService.findProductById(id);
    }

    @GetMapping("getTotalNumber")
    @CrossOrigin("*")
    public long getTotalNumberOfProducts(){
        return this.productService.getTotalNumberOfProducts();
    }

    @RequestMapping(value = "getTotalNumber/{id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public int getTotalNumberOfProductsWithinCategory(@PathVariable int id){
        return this.productService.getTotalNumberOfProductsByCategory(id);
    }

    @GetMapping("listAll")
    @CrossOrigin("*")
    public List<Product> listAllProducts(){
        return this.productService.listAllProducts();
    }

    @RequestMapping(value = "listAll/{id}", method = RequestMethod.GET)
    @CrossOrigin("*")
    public List<Product> listAllProductsByCategory(@PathVariable int id){
        return this.productService.listAllProductsByCategory(id);
    }
}
