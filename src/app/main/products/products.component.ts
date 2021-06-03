import { AccountService } from 'src/app/services/account/account.service';
import { ProductReviewService } from './../../services/product/product-review.service';
import { ProductReview } from './../../model/productReview';
import { CategoryService } from './../../services/product/category.service';
import { Category } from './../../model/category';
import { ProductService } from './../../services/product/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  categories = new MatTableDataSource<Category>();
  newCategoryName: string = "";
  listedReviews = new MatTableDataSource<ProductReview>();
  pageSizeOptionsSet: Set<number> = new Set<number>();
  pageSizeOptions: Array<number>;
  displayedColumnsCategories = ["categoryName", "actions"];
  displayedColumnsReviews = ["nameSurname", "productName", "review","actions"];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService, private categoryService: CategoryService,
      private productReviewService: ProductReviewService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.categoryService.getListOfCategories().then(response => {
      this.categories.data = response;
    })
  }

  editReview(review: ProductReview): void {
    this.productReviewService.updateProductReview(review.product_id, review.account_id, review).then(() => {
      Swal.fire({
        title: "Оцена успешно промењена",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом промене података",
        text: "Није могуће променити оцену рецензије. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  showComment(review: ProductReview): void {
    Swal.fire({
      title: "Приказ изабраног коментара",
      input: "textarea",
      inputValue: review.comment,
      inputAutoTrim: true,
      inputOptions: {
        maxlength: 64
      },
      showCancelButton: false,
      confirmButtonText: "Измени коментар",
      allowOutsideClick: false
    }).then(response => {
      if (!review.comment.localeCompare(response.value, "sr-RS")) { /* Not working - fix pending */
        review.comment = response.value;

        this.productReviewService.updateProductReview(review.product_id, review.account_id, review).then(() => {
          Swal.fire({
            title: "Коментар успешно промењен",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        }, reject => {
          //console.log(reject);
          Swal.fire({
            title: "Грешка приликом промене података",
            text: "Није могуће променити коментар рецензије. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
      
    });
  }

  listReviews(): void {
    Swal.fire({
      title: "Изаберите жељени начин листања рецензија",
      input: "radio",
      inputOptions: {
        '0': 'Прикажи све',
        '1': 'По корисничком налогу',
        '2': 'По производу'
      },
      inputValidator: result => !result && "Нисте изабрали ни један начин",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Настави",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(choice => {
      switch (choice.value) {
        case "0": this.listAllReviews(); break;
        case "1": this.listAllReviewsByAccount(); break;
        case "2": this.listAllReviewsByProduct(); break;
      }
    });
  }

  listAllReviews() {
    this.productReviewService.getListOfProductReviews().then(response => {
      response.forEach(review => {
        this.accountService.findAccount(review.account_id).then(response => {
          review.accountNameSurname = response.name + " " + response.surname;
        }, reject => Promise.reject(reject));
        this.productService.findProduct(review.product_id).then(response => {
          review.productName = response.name;
        }, reject => Promise.reject(reject));
      });
      
      setTimeout(() => {
        this.listedReviews.data = response;
        this.listedReviews.sort = this.sort;
        this.listedReviews.paginator = this.paginator;

        this.pageSizeOptionsSet.clear();

        if (this.listedReviews.data.length === 0) { //No reviews found
          Swal.fire({
            title: "Није пронађена ниједна рецензија у бази",
            icon: "info",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
          return;
        }

        this.pageSizeOptionsSet.add(1);
        this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 2));
        this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 5));
        this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 8));
        this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 10));
        this.pageSizeOptionsSet.add(this.listedReviews.data.length);
        this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);

        Swal.fire({
          title: "Подаци о рецензијама су успешно учитани",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        });
      }, 2000); /* To give time to gather all data */
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети листу рецензија. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  listAllReviewsByAccount() {
    this.accountService.getListOfAccounts().then(response => {
      var selectionData: Map<number, string> = new Map<number, string>();

      response.forEach(account => {
        selectionData.set(account.id, account.name + " " + account.surname);
      });

      Swal.fire({
        title: "Изаберите корисника",
        input: "select",
        inputOptions: selectionData,
        inputValidator: result => !result && "Нисте изабрали ни један кориснички налог",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Прикажи број рецензија",
        confirmButtonColor: "green",
        cancelButtonText: "Одустани",
        cancelButtonColor: "red",
        allowOutsideClick: false
      }).then(choice => {
        if (choice.isConfirmed) {
          this.productReviewService.getTotalNumberByAccount(choice.value).then(response => {
            var message: string = "";
            if (response === 0) message = "У бази се не налази ниједна рецензија изабраног корисника";
            else message = "Укупан број свих рецензија за изабраног корисника је " + response,
              Swal.fire({
                title: message,
                icon: "info",
                showConfirmButton: response !== 0,
                showCancelButton: true,
                confirmButtonText: "Прикажи рецензије",
                cancelButtonText: "Одустани",
                allowOutsideClick: false
              }).then(confirmation => {
                if (confirmation.isConfirmed) {
                  this.productReviewService.getListOfProductReviewsByAccount(choice.value).then(response => {
                    response.forEach(review => {
                      this.accountService.findAccount(review.account_id).then(response => {
                        review.accountNameSurname = response.name + " " + response.surname;
                      }, reject => Promise.reject(reject));
                      this.productService.findProduct(review.product_id).then(response => {
                        review.productName = response.name;
                      }, reject => Promise.reject(reject));
                    });
                    
                    setTimeout(() => {
                      this.listedReviews.data = response;
                      this.listedReviews.sort = this.sort;
                      this.listedReviews.paginator = this.paginator;
              
                      this.pageSizeOptionsSet.clear();
              
                      this.pageSizeOptionsSet.add(1);
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 2));
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 5));
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 8));
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 10));
                      this.pageSizeOptionsSet.add(this.listedReviews.data.length);
                      this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);
              
                      Swal.fire({
                        title: "Подаци о рецензијама су успешно учитани",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "У реду",
                        allowOutsideClick: false
                      });
                    }, 2000); /* To give time to gather all data */
                  }, reject => {
                    //console.log(reject);
                    Swal.fire({
                      title: "Грешка приликом преузимања података",
                      text: "Није могуће преузети листу рецензија. Проверите да ли је Spring REST сервис активан.",
                      icon: "error",
                      showCancelButton: false,
                      confirmButtonText: "У реду",
                      allowOutsideClick: false
                    });
                  });
                }
              });
          }, reject => {
            //console.log(reject);
            Swal.fire({
              title: "Грешка приликом преузимања података",
              text: "Није могуће преузети укупан број свих рецензија за изабраног корисника. Проверите да ли је Spring REST сервис активан.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
          });
        }
      });
    });
  }

  listAllReviewsByProduct() {
    this.productService.getListOfProducts().then(response => {
      var selectionData: Map<number, string> = new Map<number, string>();

      response.forEach(product => {
        selectionData.set(product.id, product.name);
      });

      Swal.fire({
        input: "select",
        title: "Изаберите производ",
        inputOptions: selectionData,
        inputValidator: result => !result && "Нисте изабрали ни један производ",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Прикажи за изабрани производ",
        confirmButtonColor: "green",
        cancelButtonText: "Одустани",
        cancelButtonColor: "red",
        allowOutsideClick: false
      }).then(choice => {
        if (choice.isConfirmed) {
          this.productReviewService.getTotalNumberByProduct(choice.value).then(response => {
            var message: string = "";
            if (response === 0) message = "У бази се не налази ниједна рецензија за изабран производ";
            else message = "Укупан број свих рецензија за изабран производ је " + response,
              Swal.fire({
                title: message,
                icon: "info",
                showConfirmButton: response !== 0,
                showCancelButton: true,
                confirmButtonText: "Прикажи рецензије",
                cancelButtonText: "Одустани",
                allowOutsideClick: false
              }).then(confirmation => {
                if (confirmation.isConfirmed) {
                  this.productReviewService.getListOfProductReviewsByProduct(choice.value).then(response => {
                    response.forEach(review => {
                      this.accountService.findAccount(review.account_id).then(response => {
                        review.accountNameSurname = response.name + " " + response.surname;
                      }, reject => Promise.reject(reject));
                      this.productService.findProduct(review.product_id).then(response => {
                        review.productName = response.name;
                      }, reject => Promise.reject(reject));
                    });
                    
                    setTimeout(() => {
                      this.listedReviews.data = response;
                      this.listedReviews.sort = this.sort;
                      this.listedReviews.paginator = this.paginator;
              
                      this.pageSizeOptionsSet.clear();
              
                      this.pageSizeOptionsSet.add(1);
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 2));
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 5));
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 8));
                      this.pageSizeOptionsSet.add(Math.floor(this.listedReviews.data.length / 10));
                      this.pageSizeOptionsSet.add(this.listedReviews.data.length);
                      this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);
              
                      Swal.fire({
                        title: "Подаци о рецензијама су успешно учитани",
                        icon: "success",
                        showCancelButton: false,
                        confirmButtonText: "У реду",
                        allowOutsideClick: false
                      });
                    }, 2000); /* To give time to gather all data */
                  }, reject => {
                    //console.log(reject);
                    Swal.fire({
                      title: "Грешка приликом преузимања података",
                      text: "Није могуће преузети листу рецензија за изабрани производ. Проверите да ли је Spring REST сервис активан.",
                      icon: "error",
                      showCancelButton: false,
                      confirmButtonText: "У реду",
                      allowOutsideClick: false
                    });
                  });
                }
              });
          }, reject => {
            //console.log(reject);
            Swal.fire({
              title: "Грешка приликом преузимања података",
              text: "Није могуће преузети укупан број свих рецензија за изабрани производ. Проверите да ли је Spring REST сервис активан.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
          });
        }
      });
    });
  }

  addNewCategory(): void {
    this.categoryService.addNewCategory({ name: this.newCategoryName }).then(response => {
      Swal.fire({
        title: "Успешно додата нова категорија " + response.id,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      }).then(() => window.location.reload());
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом додавања нове категорије",
        text: "Није могуће додати нову категорију. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  editCategory(category: Category): void {
    this.categoryService.updateCategory(category.id, category).then(response => {
      if (response === null) return;
      Swal.fire({
        title: "Успешно промењени подаци категорије " + category.id,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом промене података",
        text: "Није могуће променити податке категорије. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    })
  }

  deleteCategory(categoryId: number): void {
    Swal.fire({
      title: "Потврда уклањања категорије са ИД-јем " + categoryId,
      text: "Да ли сте сигурни да желите да уклоните ову категорију? Производима ће бити додељена подразумевана категорија",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да",
      confirmButtonColor: "red",
      cancelButtonText: "Не",
      cancelButtonColor: "green",
      allowOutsideClick: false
    }).then(() => {
      this.productService.getListOfProductsWithinCategory(categoryId).then(response => {
        this.categoryService.findCategory(0).then(defaultCategory => {
          response.forEach(product => {
            product.category = defaultCategory;
            this.productService.updateProduct(product.id, product, false, false);
          });
        });
      });
  
      setTimeout(() => {
        this.categoryService.deleteCategory(categoryId).then(() => {
          Swal.fire({
            title: "Успешно уклоњени подаци категорије " + categoryId,
            text: "Свим производима из ове категорије је додељена подразумевана категорија.",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          }).then(() => window.location.reload());
        }, reject => {
          //console.log(reject);
          Swal.fire({
            title: "Грешка приликом уклањања података",
            text: "Није могуће уклонити податке категорије. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }, 1000); /* To give time for products to be updated */
    });
  }

  showNumberOfCategoryProducts(categoryId: number): void {
    this.productService.getTotalNumberWithinCategory(categoryId).then(response => {
      Swal.fire({
        title: "Укупан број производа који припадају овој категорији је " + response,
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети податке о броју производа. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }
}
