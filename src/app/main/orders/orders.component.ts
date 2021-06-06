import { Account } from './../../model/account';
import { ProductService } from './../../services/product/product.service';
import { Product } from 'src/app/model/product';
import { OrderProductService } from './../../services/order/order-product.service';
import { OrderService } from './../../services/order/order.service';
import { Order } from './../../model/order';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from 'src/app/services/account/account.service';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  listedOrders = new MatTableDataSource<Order>();
  listedOrderProdructs = new MatTableDataSource<Product>();
  shippingMethods: Map<string, string> = new Map<string, string>([["PERSONAL", "Лично преузимање"], ["COURIER", "Курирска служба"], ["POST", "Пошта"]]);
  statusOptions: Map<string, string> = new Map<string, string>([["PENDING", "Текућа"], ["CANCELED", "Отказана"], ["COMPLETED", "Завршена"]]);
  displayedColumns: Array<string> = ["nameSurname", "shippingMethod", "status", "actions"];
  displayedColumnsOP: Array<string> = ["productName", "productCategory", "orderedQuantity", "totalCost"];
  pageSizeOptionsSet: Set<number> = new Set<number>();
  pageSizeOptions: Array<number>;
  subtotalOfOrderedProducts: number;
  accounts: Array<Account>;
  products: Array<Product>;
  filteredProductNames: Observable<Array<string>> = new Observable<Array<string>>(); /* For autocomplete values */
  productsPurchased: Array<Product> = new Array<Product>();
  productInputControl = new FormControl();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild("productInput") productInput: ElementRef<HTMLInputElement>;

  constructor(private cs: CryptoService, private accountService: AccountService, private productService: ProductService,
    private orderService: OrderService, private orderProductService: OrderProductService) { }

  ngOnInit(): void {
    this.accountService.getListOfAccounts().then(response => { this.accounts = response });
    this.productService.getListOfProducts().then(response => {
      this.products = response.filter(product => product.leftInStock > 0); //To not include out of stock products
      this.filteredProductNames = this.productInputControl.valueChanges.pipe(startWith(null), map(
        (name: string | null) => name ? this.products.map(product => { return product.name + " ( " + product.category.name + " )" }).filter
          (productName => productName.toLowerCase().indexOf(name.toLowerCase()) === 0)
          : this.products.map(product => { return product.name + " ( " + product.category.name + " )" }).slice())
      );
    });
  }

  checkRequiredFields(form: FormGroup): boolean {
    var isAllValid: boolean = true;
    Object.keys(form.controls).forEach(id => {
      if (form.controls[id].hasError('required')) isAllValid = false;
    });
    return isAllValid;
  }

  addSelectedProduct(event: MatAutocompleteSelectedEvent): void {    
    var selectedProduct: Product = this.productsPurchased.find(product => event.option.viewValue.startsWith(product.name, 0));

    if (selectedProduct === undefined) {
      selectedProduct = this.products.find(product => event.option.viewValue.startsWith(product.name, 0));

      if (selectedProduct.leftInStock > 1) {
        selectedProduct.orderedQuantity = 1;
        this.productsPurchased.push(selectedProduct);
      }
    }
    else if (selectedProduct.orderedQuantity < selectedProduct.leftInStock)
      selectedProduct.orderedQuantity++;
  }

  removeSelectedProduct(product: Product): void {
    const index = this.productsPurchased.indexOf(product);
    this.productsPurchased[index].orderedQuantity--;
    if (this.productsPurchased[index].orderedQuantity === 0) this.productsPurchased.splice(index, 1);
  }

  addNewOrder(form: NgForm) {
    this.orderService.addNewOrder({
      account_id: parseInt(form.controls["purchaser"].value.toString()),
      shippingMethod: form.controls["shippingMethod"].value,
      status: form.controls["status"].value
    }).then(response => {
      this.productsPurchased.forEach(pProduct => {
        this.orderProductService.addNewOrderProduct({
          order_id: response.id,
          product_id: pProduct.id,
          quantity: pProduct.orderedQuantity
        });
        pProduct.leftInStock -= pProduct.orderedQuantity;
        delete pProduct.markedForDeletion //Remove not needed property
        delete pProduct.orderedQuantity //Remove not needed property
        this.productService.updateProduct(pProduct.id, pProduct, false, pProduct.leftInStock === 0); //Update leftInStock value
      });

      setTimeout(() => {
        Swal.fire({
          title: "Успешно су унети подаци о новој поруџбини и њеним купљеним производима",
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        }).then(() => window.location.reload());
      }, 2000);
    }, reject => {
      //console.error(reject);
      Swal.fire({
        title: "Грешка приликом додавања нове поруџбине",
        text: "Нова поруџбина не може бити додата. Проверите да ли су сви потребни Spring REST сервиси активни.",
        icon: "warning",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }
  
  editOrder(order: Order): void {
    
    order.shippingMethod = order.shippingMethodNew === undefined ? order.shippingMethod : order.shippingMethodNew;
    order.status = order.statusNew === undefined ? order.status : order.statusNew;
    
    if (order.shippingMethodNew === undefined && order.statusNew === undefined) return;

    this.orderService.updateOrder(order.id, order).then(response => {
      Swal.fire({
        title: "Успешно промењени подаци поруџбине " + order.id,
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.error(reject);
      Swal.fire({
        title: "Грешка приликом промене података",
        text: "Није могуће променити податке поруџбине. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  deletion(orderId: number): void {
    Swal.fire({
      title: 'Изаберите жељену опцију?',
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: `Уклони поруџбину`,
      denyButtonText: `Уклони поручене производе`,
      allowOutsideClick: false
    }).then(option => {
      if (option.isConfirmed) this.deleteOrder(orderId);
      if (option.isDenied) this.deleteOrderProduct(orderId);
    });
  }

  private deleteOrder(orderId: number): void {
    Swal.fire({
      title: "Потврда уклањања поруџбине са ИД-јем " + orderId,
      text: "Да ли сте сигурни да желите да уклоните податке ове поруџбине?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да",
      confirmButtonColor: "red",
      cancelButtonText: "Не",
      cancelButtonColor: "green",
      allowOutsideClick: false
    }).then(choice => {
      if (choice.isConfirmed) {
        this.orderService.deleteOrder(orderId).then(() => { //Response will be null
          Swal.fire({
            title: "Успешно уклоњен подаци о поруџбини са ИД-јем " + orderId,
            text: "Заједно са тим су уклоњене све информације о порученим производима ове поруџбине из базе",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          }).then(() => {
            this.listOrders();
          });
        }, reject => {
          //console.error(reject);
          Swal.fire({
            title: "Грешка приликом уклањања података о поруџбини са ИД-јем " + orderId,
            text: "Поруџбина са ИД-јем " + orderId + " не може бити уклоњена. Проверите да ли су сви потребни Spring REST сервиси активни.",
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }

  private deleteOrderProduct(orderId: number) {
    this.orderProductService.getListOfOrderProductsByOrder(orderId).then(response => {
      var html: string = "";
      var j = 0;
      response.forEach(orderedProduct => {
        this.productService.findProduct(orderedProduct.product_id).then(op => {
          html += `
            <div>
                <input type="checkbox" id="checkbox` + j + `">
                <label class="form-check-label" for="checkbox`+ j + `">
                ` + op.name + " (" + orderedProduct.quantity + " комада ) *" + op.id + `
                </label>
            </div>
          `;
          j++;
        });
      })

      setTimeout(() => {
        Swal.fire({
          title: "Изаберите производе које желите да уклоните",
          html: html,
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Уклони изабране производе",
          confirmButtonColor: "red",
          cancelButtonText: "Одустани",
          cancelButtonColor: "green",
          allowOutsideClick: false,
          preConfirm: () => {
            var markedProducts: Array<number> = new Array<number>();
            var labels = Swal.getPopup().getElementsByClassName("form-check-label");
            
            for (var i = 0; i < labels.length; i++) {
              const checkBox = <HTMLInputElement>Swal.getPopup().querySelector("#" + (labels[i] as HTMLLabelElement).htmlFor);
              
              if (checkBox.checked)
                markedProducts.push(parseInt(labels[i].innerHTML.split('*')[1]));
            }
            
            return markedProducts;
          }
        }).then(response => {
          if (response.value.length === 0) return; //Nothing selected

          response.value.forEach(productId => {
            this.orderProductService.deleteOrderProduct(orderId, productId);
          });
          
          setTimeout(() => {
            if (response.value.length === j) { //All products deleted
              this.orderService.deleteOrderOnly(orderId).then(() => {
                Swal.fire({
                  title: "Поруџбина уклоњена јер су сви њени производи уклоњени",
                  icon: "info",
                  showCancelButton: false,
                  confirmButtonText: "У реду",
                  allowOutsideClick: false
                }).then(() => this.listOrders());
              });
            }
            else {
              Swal.fire({
                title: "Уклањање изабраних производа успешно",
                icon: "success",
                showCancelButton: false,
                confirmButtonText: "У реду",
                allowOutsideClick: false
              });
            }
          }, 2000);
        });
      }, 1000);
    }, reject => {
      //console.error(reject);
    })
  }

  showOrderedItems(id: number): void {
    this.orderProductService.getSubtotalByOrder(id).then(response => {
      this.subtotalOfOrderedProducts = response;
    })
    
    this.orderProductService.getListOfOrderProductsByOrder(id).then(response => {
      var orderedProducts: Array<Product> = new Array<Product>();
      response.forEach(data => {
        this.productService.findProduct(data.product_id).then(response => {
          response.orderedQuantity = data.quantity;
          orderedProducts.push(response);
        })
      })
      
      setTimeout(() => {
        this.listedOrderProdructs.data = orderedProducts;
      }, 1000);

      setTimeout(() => {
        Swal.fire({
          title: "Приказ поручених производа за поруџбину " + id,
          html: document.querySelector("#orderedProductsDiv").innerHTML,
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        });
      }, 1001);
    }, reject => {
      //console.error(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података о порученим производима за поруџбину са ИД-јем " + id,
        text: "Проверите да ли су сви потребни Spring REST сервиси активани.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      })
    });
  }

  find(): void {
    Swal.fire({
      title: "Претрага поруџбина",
      html: `<html><body>
                <span>Унесите ИД поруџбине:</span><br>
                <input type='number' id='prodavnica-oie-admin-orderId'
                min='1' class='swal2-input'>
            </body></html>`,
      icon: "question", /* input:"number" is not used because of css style */
      showCancelButton: true,
      confirmButtonText: "Пронађи",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(response => {
      if (response.isConfirmed) {
        var orderId = (<HTMLInputElement>Swal.getPopup().querySelector("#prodavnica-oie-admin-orderId")).value;
        this.orderService.findOrder(parseInt(orderId)).then(response => {
          if (response != null)
            Swal.fire({
              title: "Пронађени су подаци поруџбине са ИД-јем " + orderId,
              text: JSON.stringify(response),
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
          else
            Swal.fire({
              title: "Грешка приликом проналажења поруџбине",
              text: "Поруџбина са ИД-јем " + orderId + " се не налази у бази података!",
              icon: "warning",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
        }, reject => {
          //console.error(reject);
          Swal.fire({
            title: "Грешка приликом проналажења поруџбине",
            text: "Није могуће пронађи поруџбину. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }

  showTotal(): void {
    Swal.fire({
      title: "Изаберите жељени критеријум",
      input: "radio",
      inputOptions: {
        '0': 'Све поруџбине',
        '1': 'Од одређеног корисника',
        '2': 'Са одређеним начином доставе',
        '3': 'Са одређеним статусом'
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
        case "0": this.showTotalOfAllOrders(); break;
        case "1": this.showTotalOfAllOrdersByAccount(); break;
        case "2": this.showTotalOfAllOrdersByShippingMethod(); break;
        case "3": this.showTotalOfAllOrdersByStatus(); break;
      }
    });
  }

  showTotalOfAllOrders() {
    this.orderService.getTotalNumber().then(response => {
      Swal.fire({
        title: "Укупан број свих поруџбина је " + response,
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.error(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети укупан број свих поруџбина. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }
  
  private showTotalOfAllOrdersByAccount() {
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
        confirmButtonText: "Прикажи укупан број поруџбина",
        confirmButtonColor: "green",
        cancelButtonText: "Одустани",
        cancelButtonColor: "red",
        allowOutsideClick: false
      }).then(choice => {
        if (choice.isConfirmed) {
          this.orderService.getTotalNumberFromAccount(choice.value).then(response => {
            var message: string = "";
            if (response === 0) message = "У бази се не налази ниједна поруџбина изабраног корисника";
            else message = "Укупан број свих поруџбина за изабраног корисника је " + response,

              Swal.fire({
                title: message,
                icon: "info",
                showCancelButton: false,
                confirmButtonText: "У реду",
                allowOutsideClick: false
              });
          }, reject => {
            //console.error(reject);
            Swal.fire({
              title: "Грешка приликом преузимања података",
              text: "Није могуће преузети укупан број свих поруџбина за изабраног корисника. Проверите да ли је Spring REST сервис активан.",
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

  private showTotalOfAllOrdersByShippingMethod() {
    Swal.fire({
      title: "Изаберите начин доставе",
      input: "radio",
      inputOptions: {
        "PERSONAL": "Лично преузимање",
        "COURIER": "Курирска служба",
        "POST": "Пошта"

      },
      inputValidator: result => !result && "Нисте изабрали ни један начин доставе",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Прикажи укупан број поруџбина",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(choice => {
      if (choice.isConfirmed) {
        this.orderService.getTotalNumberWithShippingMethod(choice.value).then(response => {
          var message: string = "";
          if (response === 0) message = "У бази се не налази ниједна поруџбина са изабраним начином доставе";
          else message = "Укупан број свих поруџбина са изабраним начином доставе је " + response,

            Swal.fire({
              title: message,
              icon: "info",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
        }, reject => {
          //console.error(reject);
          Swal.fire({
            title: "Грешка приликом преузимања података",
            text: "Није могуће преузети укупан број свих поруџбина са изабраним начином доставе. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }
  
  private showTotalOfAllOrdersByStatus() {
    Swal.fire({
      title: "Изаберите статус поруџбине",
      input: "radio",
      inputOptions: {
        "PENDING": "Текућа",
        "CANCELED": "Отказана",
        "COMPLETED": "Завршена"
      },
      inputValidator: result => !result && "Нисте изабрали ни један статус поруџбине",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Прикажи укупан број поруџбина",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(choice => {
      if (choice.isConfirmed) {
        this.orderService.getTotalNumberWithStatus(choice.value).then(response => {
          var message: string = "";
          if (response === 0) message = "У бази се не налази ниједна поруџбина са изабраним статусом";
          else message = "Укупан број свих поруџбина са изабраним статусом је " + response,

            Swal.fire({
              title: message,
              icon: "info",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
        }, reject => {
          //console.error(reject);
          Swal.fire({
            title: "Грешка приликом преузимања података",
            text: "Није могуће преузети укупан број свих поруџбина са изабраним статусом. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }

  showTotalOfOrderedProducts(): void {
    var totalNumberOfOrderedProducts = 0;
    this.productService.getTotalNumber().then(response => {
      totalNumberOfOrderedProducts = response
    
      this.productService.getListOfProducts().then(response => {
        var selectionData: Map<number, string> = new Map<number, string>();
  
        response.forEach(product => {
          selectionData.set(product.id, product.name);
        });
  
        Swal.fire({
          title: "Укупно је поручено " + totalNumberOfOrderedProducts + " производа",
          input: "select",
          inputLabel: "Изаберите производ",
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
            this.orderProductService.getTotalNumberByProduct(choice.value).then(response => {
              Swal.fire({
                title: "Изабрани производ је поручен " + response + " пута",
                icon: "info",
                showCancelButton: false,
                confirmButtonText: "У реду",
                allowOutsideClick: false
              });
            }, reject => {
              //console.error(reject);
              Swal.fire({
                title: "Грешка приликом преузимања података",
                text: "Није могуће преузети укупан број свих поруџбина за изабраног корисника. Проверите да ли је Spring REST сервис активан.",
                icon: "error",
                showCancelButton: false,
                confirmButtonText: "У реду",
                allowOutsideClick: false
              });
            });
          }
        });
      });
    });
  }

  listOrders(): void {
    Swal.fire({
      title: "Изаберите жељени начин листања поруџбина",
      input: "radio",
      inputOptions: {
        '0': 'Прикажи све',
        '1': 'По корисничком налогу',
        '2': 'По начину доставе',
        '3': 'По статусу'
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
        case "0": this.listAllOrders(); break;
        case "1": this.listAllOrdersByAccount(); break;
        case "2": this.listAllOrdersByShippingMethod(); break;
        case "3": this.listAllOrdersByStatus(); break;
      }
    });
  }

  private listAllOrders(): void {
    this.orderService.getListOfOrders().then(response => {
      response.forEach(order => {
        this.accountService.findAccount(order.account_id).then(response => {
          order.accountName = response.name;
          order.accountSurname = response.surname;
        })
      });
      
      this.listedOrders.data = response;
      this.listedOrders.sort = this.sort;
      this.listedOrders.paginator = this.paginator;

      this.pageSizeOptionsSet.clear();

      if (this.listedOrders.data.length === 0) { //No orders found
        Swal.fire({
          title: "Није пронађена ниједна поруџбина у бази",
          icon: "info",
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        });
        return;
      }

      this.pageSizeOptionsSet.add(1);
      this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 2));
      this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 5));
      this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 8));
      this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 10));
      this.pageSizeOptionsSet.add(this.listedOrders.data.length);
      this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);

      Swal.fire({
        title: "Подаци о поруџбинама су успешно учитани",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.error(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети листу поруџбина. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  private listAllOrdersByAccount(): void {
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
        confirmButtonText: "Прикажи поруџбине",
        confirmButtonColor: "green",
        cancelButtonText: "Одустани",
        cancelButtonColor: "red",
        allowOutsideClick: false
      }).then(choice => {
        if (choice.isConfirmed) {
          this.orderService.getListOfOrdersByAccount(choice.value).then(response => {
            response.forEach(order => {
              this.accountService.findAccount(order.account_id).then(response => {
                order.accountName = response.name;
                order.accountSurname = response.surname;
              })
            });
          
            this.listedOrders.data = response;
            this.listedOrders.sort = this.sort;
            this.listedOrders.paginator = this.paginator;
    
            this.pageSizeOptionsSet.clear();

            if (this.listedOrders.data.length === 0) { //No orders from selected account found
              Swal.fire({
                title: "Није пронађена ниједна поруџбина за изабраног корисника",
                icon: "info",
                showCancelButton: false,
                confirmButtonText: "У реду",
                allowOutsideClick: false
              });
              return;
            }

            this.pageSizeOptionsSet.add(1);
            this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 2));
            this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 5));
            this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 8));
            this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 10));
            this.pageSizeOptionsSet.add(this.listedOrders.data.length);
            this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);

            Swal.fire({
              title: "Подаци о поруџбинама изабраног корисника су успешно учитани",
              icon: "success",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
          }, reject => {
            //console.error(reject);
            Swal.fire({
              title: "Грешка приликом преузимања података",
              text: "Није могуће преузети листу поруџбина. Проверите да ли је Spring REST сервис активан.",
              icon: "error",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
          });
        }
      });
    })
  }

  private listAllOrdersByShippingMethod(): void {
    Swal.fire({
      title: "Изаберите начин доставе",
      input: "radio",
      inputOptions: {
        "PERSONAL": "Лично преузимање",
        "COURIER": "Курирска служба",
        "POST": "Пошта"

      },
      inputValidator: result => !result && "Нисте изабрали ни један начин доставе",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Прикажи поруџбине",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(choice => {
      if (choice.isConfirmed) {
        this.orderService.getListOfOrdersWithShippingMethod(choice.value).then(response => {
          response.forEach(order => {
            this.accountService.findAccount(order.account_id).then(response => {
              order.accountName = response.name;
              order.accountSurname = response.surname;
            })
          });
        
          this.listedOrders.data = response;
          this.listedOrders.sort = this.sort;
          this.listedOrders.paginator = this.paginator;
  
          this.pageSizeOptionsSet.clear();

          if (this.listedOrders.data.length === 0) { //No orders with selected shipping method found
            Swal.fire({
              title: "Није пронађена ниједна поруџбина са изабраним начином доставе",
              icon: "info",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
            return;
          }

          this.pageSizeOptionsSet.add(1);
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 2));
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 5));
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 8));
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 10));
          this.pageSizeOptionsSet.add(this.listedOrders.data.length);
          this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);

          Swal.fire({
            title: "Подаци о поруџбинама са изабраним начином доставе су успешно учитани",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        }, reject => {
          //console.error(reject);
          Swal.fire({
            title: "Грешка приликом преузимања података",
            text: "Није могуће преузети листу поруџбина. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }

  private listAllOrdersByStatus(): void {
    Swal.fire({
      title: "Изаберите статус поруџбине",
      input: "radio",
      inputOptions: {
        "PENDING": "Текућа",
        "CANCELED": "Отказана",
        "COMPLETED": "Завршена"
      },
      inputValidator: result => !result && "Нисте изабрали ни један статус поруџбине",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Прикажи поруџбине",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(choice => {
      if (choice.isConfirmed) {
        this.orderService.getListOfOrdersWithStatus(choice.value).then(response => {
          response.forEach(order => {
            this.accountService.findAccount(order.account_id).then(response => {
              order.accountName = response.name;
              order.accountSurname = response.surname;
            })
          });
        
          this.listedOrders.data = response;
          this.listedOrders.sort = this.sort;
          this.listedOrders.paginator = this.paginator;
  
          this.pageSizeOptionsSet.clear();

          if (this.listedOrders.data.length === 0) { //No orders with selected status found
            Swal.fire({
              title: "Није пронађена ниједна поруџбина са изабраним статусом",
              icon: "info",
              showCancelButton: false,
              confirmButtonText: "У реду",
              allowOutsideClick: false
            });
            return;
          }

          this.pageSizeOptionsSet.add(1);
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 2));
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 5));
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 8));
          this.pageSizeOptionsSet.add(Math.floor(this.listedOrders.data.length / 10));
          this.pageSizeOptionsSet.add(this.listedOrders.data.length);
          this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);

          Swal.fire({
            title: "Подаци о поруџбинама са изабраним статусом су успешно учитани",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        }, reject => {
          //console.error(reject);
          Swal.fire({
            title: "Грешка приликом преузимања података",
            text: "Није могуће преузети листу поруџбина. Проверите да ли је Spring REST сервис активан.",
            icon: "error",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });
  }
}