package pr.markodojkic.prodavnicaoieadmin.product.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pr.markodojkic.prodavnicaoieadmin.product.entity.Category;
import pr.markodojkic.prodavnicaoieadmin.product.repository.ICategoryRepository;

import java.util.List;
import java.util.stream.Collectors;

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
        if(category == null || id == 0 || newCategoryData.getName().equals(category.getName())) return null;
        //0 is for default category so it cannot be change, also if nothing is changed no need to update
        if(newCategoryData.getName() != null) category.setName(newCategoryData.getName());

        return this.addNewCategory(category);
    }

    @Override
    public void deleteCategoryById(int id) {
      if(id == 0) return; //0 is for default category
      this.categoryRepository.deleteById(id);
    }

    @Override
    public Category findCategoryById(int id) {
        return this.categoryRepository.findById(id).isPresent()
          ? this.categoryRepository.findById(id).get() : null;
    }

    @Override
    public long getTotalNumberOfCategories() {
        return this.categoryRepository.count()-1; //0 is for default category, so hide it
    }

    @Override
    public List<Category> listAllCategories() {
        return this.categoryRepository.findAll().stream().skip(1).collect(Collectors.toList()); //0 is for default category, so hide it
    }
}
