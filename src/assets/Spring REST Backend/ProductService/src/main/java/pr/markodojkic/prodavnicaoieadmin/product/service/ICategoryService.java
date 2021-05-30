package pr.markodojkic.prodavnicaoieadmin.product.service;

import pr.markodojkic.prodavnicaoieadmin.product.entity.Category;

import java.util.List;

public interface ICategoryService {
    Category addNewCategory(Category newCategory);
    Category updateCategoryById(int id, Category newCategoryData);
    void deleteCategoryById(int id);
    Category findCategoryById(int id);
    long getTotalNumberOfCategories();
    List<Category> listAllCategories();
}
