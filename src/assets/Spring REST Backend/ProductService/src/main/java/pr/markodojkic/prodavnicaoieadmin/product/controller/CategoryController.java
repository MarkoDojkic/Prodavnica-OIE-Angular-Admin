package pr.markodojkic.prodavnicaoieadmin.product.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pr.markodojkic.prodavnicaoieadmin.product.entity.Category;
import pr.markodojkic.prodavnicaoieadmin.product.service.CategoryService;

import java.util.List;

@RestController()
@RequestMapping("api/prodavnicaoieadmin/category")
public class CategoryController {
   @Autowired
   private CategoryService categoryService;

   @PostMapping("insert")
   @CrossOrigin("*")
   public Category addNewCategory(@RequestBody Category newCategory){
       return this.categoryService.addNewCategory(newCategory);
   }

   @RequestMapping(value = "update/{id}", method = RequestMethod.PATCH)
   @CrossOrigin("*")
   public Category updateCategory(@PathVariable int id, @RequestBody Category newCategoryData){
       return this.categoryService.updateCategoryById(id, newCategoryData);
   }

   @RequestMapping(value = "delete/{id}", method = RequestMethod.DELETE)
   @CrossOrigin("*")
   public void deleteCategory(@PathVariable int id){
       this.categoryService.deleteCategoryById(id);
   }

   @RequestMapping(value = "find/{id}", method = RequestMethod.GET)
   @CrossOrigin("*")
   public Category findCategory(@PathVariable int id){
       return this.categoryService.findCategoryById(id);
   }

   @GetMapping("getTotalNumber")
   @CrossOrigin("*")
   public Long getTotalNumberOfCategories(){
       return this.categoryService.getTotalNumberOfCategories();
   }

   @GetMapping("listAll")
   @CrossOrigin("*")
   public List<Category> listAllCategories(){
       return this.categoryService.listAllCategories();
   }
}
