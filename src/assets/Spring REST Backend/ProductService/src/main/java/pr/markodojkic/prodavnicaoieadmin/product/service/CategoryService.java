package pr.markodojkic.prodavnicaoieadmin.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.markodojkic.prodavnicaoieadmin.product.entity.Category;
import pr.markodojkic.prodavnicaoieadmin.product.repository.ICategoryRepository;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {
    @Autowired
    private ICategoryRepository categoryRepository;

    @Override
    public Category addNewCategory(Category newCategory) {
        return this.categoryRepository.saveAndFlush(newCategory);
    }

    @Override
    public Category updateCategoryById(int id, Category newCategoryData) {
        Category category = this.findCategoryById(id);
        if(category == null) return null;

        if(newCategoryData.getName() != null) category.setName(newCategoryData.getName());

        return this.addNewCategory(category);
    }

    @Override
    public void deleteCategoryById(int id) {
        this.categoryRepository.deleteById(id);
    }

    @Override
    public Category findCategoryById(int id) {
        return this.categoryRepository.findById(id).isPresent()
          ? this.categoryRepository.findById(id).get() : null;
    }

    @Override
    public long getTotalNumberOfCategories() {
        return this.categoryRepository.count();
    }

    @Override
    public List<Category> listAllCategories() {
        return this.categoryRepository.findAll();
    }
}
