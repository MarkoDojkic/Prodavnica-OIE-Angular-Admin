package pr.markodojkic.prodavnicaoieadmin.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.markodojkic.prodavnicaoieadmin.product.entity.Product;
import pr.markodojkic.prodavnicaoieadmin.product.repository.IProductRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService implements IProductService {
    @Autowired
    private IProductRepository productRepository;

    @Override
    public Product addNewProduct(Product newProduct) {
        return this.productRepository.saveAndFlush(newProduct);
    }

    @Override
    public Product updateProductById(int id, Product newProductData, boolean isFree, boolean isOutOfStock) {
        Product product = this.findProductById(id);
        if(product == null) return null;

        if(newProductData.getName() != null) product.setName(newProductData.getName());
        if(newProductData.getCategory() != null) product.setCategory(newProductData.getCategory());
        if(newProductData.getDescription() != null) product.setDescription(newProductData.getDescription());
        if(newProductData.getLeftInStock() > 0) product.setLeftInStock(newProductData.getLeftInStock());
        if(newProductData.getPrice() > 0) product.setPrice(newProductData.getPrice());

        if(isOutOfStock) product.setLeftInStock(0); //Need to be set explicitly to avoid confusion with integer null value
        if(isFree) product.setPrice(0); //Need to be set explicitly to avoid confusion with integer null value

        return this.productRepository.saveAndFlush(product);
    }

    @Override
    public void deleteProductById(int id) {
        this.productRepository.deleteById(id);
    }

    @Override
    public void deleteAllProductsWithinCategory(int category_id) {
        List<Product> productsWithinCategory = this.listAllProductsByCategory(category_id);

        this.productRepository.deleteAll(productsWithinCategory);
    }

    @Override
    public Product findProductById(int id) {
        return this.productRepository.findById(id).isPresent()
          ? this.productRepository.findById(id).get() : null;
    }

    @Override
    public long getTotalNumberOfProducts() {
        return this.productRepository.count();
    }

    @Override
    public int getTotalNumberOfProductsByCategory(int category_id) {
        return this.listAllProductsByCategory(category_id).size();
    }

    @Override
    public List<Product> listAllProducts() {
        return this.productRepository.findAll();
    }

    @Override
    public List<Product> listAllProductsByCategory(int category_id) {
        return this.productRepository.findAll().stream()
                .filter(product -> product.getCategory().getId() == category_id)
                .collect(Collectors.toList());
    }
}
