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
import { Product } from 'src/app/model/product';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  
  listedProducts = new MatTableDataSource<Product>();
  categories = new MatTableDataSource<Category>();
  productCategories: Map<number, string> = new Map<number, string>();
  newCategoryName: string = "";
  listedReviews = new MatTableDataSource<ProductReview>();
  pageSizeOptionsSet: Set<number> = new Set<number>();
  pageSizeOptions: Array<number>;
  pageSizeOptionsSetProduct: Set<number> = new Set<number>();
  pageSizeOptionsProduct: Array<number>;
  displayedColumnsProducts = ["productName_", "categoryName_", "leftInStock", "price", "actions"];
  displayedColumnsCategories = ["categoryName", "actions"];
  displayedColumnsReviews = ["nameSurname", "productName", "review","actions"];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatSort) sortProduct: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorProduct: MatPaginator;

  constructor(private productService: ProductService, private categoryService: CategoryService,
      private productReviewService: ProductReviewService, private accountService: AccountService) { }

  ngOnInit(): void {
    this.categoryService.getListOfCategories().then(response => {
      this.categories.data = response;
      response.forEach(category => {
        this.productCategories.set(category.id, category.name);
      });
    })
  }

  consoleLog(test: any): void {
    console.log(test);
  }

  editProduct(product: Product): void {
    if (product.newStockQuantity < 0) product.newStockQuantity = product.leftInStock;
    else product.leftInStock = product.newStockQuantity;

    if (product.newPrice < 0) product.newPrice = product.price;
    else product.price = product.newPrice;

    this.productService.updateProduct(product.id, product, product.newPrice === 0.00, product.newStockQuantity === 0).then(() => {
      Swal.fire({
        title: "Подаци прозивода успешно промењени",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      }).then(() => this.listProducts());
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом промене података",
        text: "Није могуће променити податке производа. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  listProducts(): void {
    this.productService.getTotalNumber().then(response => {
      var message: string = "";
      if (response === 0) message = "У бази се не налази ниједан производ";
      else message = "Укупан број свих производа је " + response;
        Swal.fire({
          title: message,
          icon: "info",
          showConfirmButton: response !== 0,
          showCancelButton: true,
          confirmButtonText: "Прикажи производе",
          confirmButtonColor: "green",
          cancelButtonText: "Одустани",
          cancelButtonColor: "red",
          allowOutsideClick: false
        }).then(confirmation => {
          if (confirmation.isConfirmed) {
            this.productService.getListOfProducts().then(response => {
              response.forEach(product => {
                product.newStockQuantity = product.leftInStock;
                product.newPrice = product.price;
              });
              this.listedProducts.data = response;
              this.listedProducts.sort = this.sortProduct;
              this.listedProducts.paginator = this.paginatorProduct;
        
              this.pageSizeOptionsSet.clear();
                
              this.pageSizeOptionsSetProduct.add(1);
              this.pageSizeOptionsSetProduct.add(Math.floor(this.listedProducts.data.length / 2));
              this.pageSizeOptionsSetProduct.add(Math.floor(this.listedProducts.data.length / 5));
              this.pageSizeOptionsSetProduct.add(Math.floor(this.listedProducts.data.length / 8));
              this.pageSizeOptionsSetProduct.add(Math.floor(this.listedProducts.data.length / 10));
              this.pageSizeOptionsSetProduct.add(this.listedProducts.data.length);
              this.pageSizeOptionsProduct = Array.from(this.pageSizeOptionsSetProduct);
        
              Swal.fire({
                title: "Подаци о производима су успешно учитани",
                icon: "success",
                showCancelButton: false,
                confirmButtonText: "У реду",
                allowOutsideClick: false
              });
            }, reject => {
              //console.log(reject);
              Swal.fire({
                title: "Грешка приликом преузимања података",
                text: "Није могуће преузети листу производа. Проверите да ли је Spring REST сервис активан.",
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

  showProductDescription(product: Product): void {
    Swal.fire({
      title: "Приказ описа изабраног прозивода",
      input: "textarea",
      inputValue: product.description,
      inputAutoTrim: true,
      showCancelButton: false,
      confirmButtonText: "Измени опис прозивода",
      allowOutsideClick: false,
      preConfirm: newDescription => {
        if ((newDescription as string).length > 512)
          Swal.showValidationMessage("Максимална дозвољена дужина описа прозивода је 512 карактера, а Ваша дужина је: " + newDescription.length);
        else return newDescription as string;
      }
    }).then(response => {
      if (!product.description.includes(response.value, 0)){  //Checks if description is changed
        product.description = response.value;

        this.productService.updateProduct(product.id, product, false, false).then(() => {
          Swal.fire({
            title: "Опис производа успешно промењен",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        }, reject => {
          //console.log(reject);
          Swal.fire({
            title: "Грешка приликом промене података",
            text: "Није могуће променити опис прозивода. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
      
    });
  }

  /* Add review */

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

  deleteReview(review: ProductReview): void {
    Swal.fire({
      title: "Потврда уклањања рецензије",
      text: "Да ли сте сигурни да желите да уклоните рецензију?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да",
      confirmButtonColor: "red",
      cancelButtonText: "Не",
      cancelButtonColor: "green",
      allowOutsideClick: false
    }).then(choice => {
      if (choice.isConfirmed) {
        this.productReviewService.deleteProductReview(review.product_id, review.account_id).then(() => {
          Swal.fire({
            title: "Успешно уклоњени подаци рецензије",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          }).then(() => this.listAllReviews());
        }, reject => {
          //console.log(reject);
          Swal.fire({
            title: "Грешка приликом уклањања података",
            text: "Није могуће уклонити податке рецензије. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }

  showComment(review: ProductReview): void {
    Swal.fire({
      title: "Приказ изабраног коментара",
      input: "textarea",
      inputValue: review.comment,
      inputAutoTrim: true,
      showCancelButton: false,
      confirmButtonText: "Измени коментар",
      allowOutsideClick: false,
      preConfirm: newComment => {
        if ((newComment as string).length > 128)
          Swal.showValidationMessage("Максимална дозвољена дужина коментара је 128 карактера, а Ваша дужина је: " + newComment.length);
        else return newComment as string;
      } 
    }).then(response => {
      if (!review.comment.includes(response.value, 0)){  //Checks if comment is changed
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
    this.productReviewService.getTotalNumber().then(response => {
      var message: string = "";
      if (response === 0) message = "У бази се не налази ниједна рецензија";
      else message = "Укупан број свих рецензија је " + response;
        Swal.fire({
          title: message,
          icon: "info",
          showConfirmButton: response !== 0,
          showCancelButton: true,
          confirmButtonText: "Прикажи рецензије",
          confirmButtonColor: "green",
          cancelButtonText: "Одустани",
          cancelButtonColor: "red",
          allowOutsideClick: false
        }).then(confirmation => {
          if (confirmation.isConfirmed) {
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
            if (response == 0) message = "У бази се не налази ниједна рецензија изабраног корисника";
            else message = "Укупан број свих рецензија за изабраног корисника је " + response;
              Swal.fire({
                title: message,
                icon: "info",
                showConfirmButton: response !== 0,
                showCancelButton: true,
                confirmButtonText: "Прикажи рецензије",
                confirmButtonColor: "green",
                cancelButtonText: "Одустани",
                cancelButtonColor: "red",
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
            else message = "Укупан број свих рецензија за изабран производ је " + response;
              Swal.fire({
                title: message,
                icon: "info",
                showConfirmButton: response !== 0,
                showCancelButton: true,
                confirmButtonText: "Прикажи рецензије",
                confirmButtonColor: "green",
                cancelButtonText: "Одустани",
                cancelButtonColor: "red",
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
    }).then(choice => {
      if (choice.isConfirmed) {
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
      }
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
