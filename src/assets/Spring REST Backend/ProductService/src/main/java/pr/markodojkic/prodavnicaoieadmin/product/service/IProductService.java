package pr.markodojkic.prodavnicaoieadmin.product.service;

import pr.markodojkic.prodavnicaoieadmin.product.entity.Product;

import java.util.List;

public interface IProductService {
    Product addNewProduct(Product newProduct);
    Product updateProductById(int id, Product newProductData, boolean isFree, boolean isOutOfStock);
    void deleteProductById(int id);
    void deleteAllProductsWithinCategory(int category_id);
    Product findProductById(int id);
    long getTotalNumberOfProducts();
    int getTotalNumberOfProductsByCategory(int category_id);
    List<Product> listAllProducts();
    List<Product> listAllProductsByCategory(int category_id);
}
