import { ProductService } from './../../services/product/product.service';
import { Product } from 'src/app/model/product';
import { OrderProductService } from './../../services/order/order-product.service';
import { OrderService } from './../../services/order/order.service';
import { Order } from './../../model/order';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AccountService } from 'src/app/services/account/account.service';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {

  listedOrders = new MatTableDataSource<Order>();
  listedOrderProdructs = new MatTableDataSource<Product>();
  shippingMethods: Map<string, string> = new Map<string, string>([["PERSONAL","Лично преузимање"],["COURIER","Курирска служба"],["POST","Пошта"]]);
  statusOptions: Map<string, string> = new Map<string, string>([["PENDING", "Текућа"], ["CANCELED", "Отказана"], ["COMPLETED", "Завршена"]]);
  displayedColumns: Array<string> = ["nameSurname", "shippingMethod", "status", "actions"];
  displayedColumnsOP: Array<string> = ["productName","productCategory","orderedQuantity","totalCost"];
  pageSizeOptionsSet: Set<number> = new Set<number>();
  pageSizeOptions: Array<number>;
  subtotalOfOrderedProducts: number;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private cs: CryptoService, private accountService: AccountService, private productService: ProductService,
    private orderService: OrderService, private orderProductService: OrderProductService) { }

  ngOnInit(): void { }
  
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
      console.log(reject);
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

  deleteOrder(orderId: number): void {
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
          console.log(reject);
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
          title: "Приказ поручених прозивода за поруџбину " + id,
          html: document.querySelector("#orderedProductsDiv").innerHTML,
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        });
      }, 1001);
    }, reject => {
      console.log(reject);
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
        this.accountService.findAccount(parseInt(orderId)).then(response => {
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
          console.log(reject);
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
      console.log(reject);
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
            console.log(reject);
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
    })
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
          console.log(reject);
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
          console.log(reject);
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
              console.log(reject);
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
      console.log(reject);
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
            console.log(reject);
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
          console.log(reject);
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
          console.log(reject);
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
/*
  addNewAccount(form: NgForm): void {
    var newAccount: Account = new Account();
    newAccount.name = form.controls["name"] === null ? "" : form.controls["name"].value;
    newAccount.surname = form.controls["surname"] === null ? "" : form.controls["surname"].value;
    newAccount.email = form.controls["email"] === null ? "" : form.controls["email"].value;
    newAccount.password_hash = this.cs.encryptSHA256("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", form.controls["password"] === null ? "" : form.controls["password"].value);
    newAccount.phoneNumber = form.controls["phone"] === null ? "" : form.controls["phone"].value;
    newAccount.mobilePhoneNumber = form.controls["mobilePhone"] === null ? "" : form.controls["mobilePhone"].value;
    newAccount.deliveryAddress = form.controls["deliveryAddress"] === null ? "" : form.controls["deliveryAddress"].value;
    newAccount.deliveryAddressPAK = form.controls["deliveryAddressPAK"] === null ? "" : form.controls["deliveryAddressPAK"].value;

    this.accountService.addNewAccount(newAccount).then(response => {
      Swal.fire({
        title: "Успешно додат нови кориснички налог",
        text: JSON.stringify(response),
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      console.log(reject);
      Swal.fire({
        title: "Грешка приликом додавања новог корисника",
        text: "Није могуће додати кориснички налог. Проверите да ли је Spring REST сервис активан, а ако јесте онда се неки подаци већ постоје у бази за други или исти налог.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  checkPasswordRepeat(pass: NgModel, repeatPass: NgModel): void {
    if (pass.value != repeatPass.value) repeatPass.control.setErrors({ "matched": true });
    else repeatPass.control.setErrors(null);
  }

  checkRequiredFields(form: FormGroup): boolean {
    var isAllValid: boolean = true;
    Object.keys(form.controls).forEach(id => {
      if(form.controls[id].hasError('required')) isAllValid = false;
    });
    return isAllValid && !form.controls["passwordRepeat"].hasError("matched");
  }

  editAccount(account: Account): void {

    account.name = account.nameNew !== undefined && account.nameNew.match("^[\u0410-\u0418\u0402\u0408\u041A-\u041F\u0409\u040A\u0420-\u0428\u040B\u040FA-Z\u0110\u017D\u0106\u010C\u0160]{1}[\u0430-\u0438\u0452\u043A-\u043F\u045A\u0459\u0440-\u0448\u0458\u045B\u045Fa-z\u0111\u017E\u0107\u010D\u0161]+$") ? account.nameNew : account.name;
    account.surname = account.surnameNew !== undefined && account.surnameNew.match("^([\u0410-\u0418\u0402\u0408\u041A-\u041F\u0409\u040A\u0420-\u0428\u040B\u040FA-Z\u0110\u017D\u0106\u010C\u0160]{1}[\u0430-\u0438\u0452\u043A-\u043F\u045A\u0459\u0440-\u0448\u0458\u045B\u045Fa-z\u0111\u017E\u0107\u010D\u0161]+(\s|\-)?)+$") ? account.surnameNew : account.surname;
    account.email  = account.emailNew !== undefined && account.emailNew.match("^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$") ? account.emailNew : account.email;
    account.password_hash = account.passwordNew !== undefined && account.passwordNew.length > 8 ? this.cs.encryptSHA256("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", account.passwordNew) : account.password_hash; 
    account.phoneNumber = account.phoneNumberNew !== undefined && account.phoneNumberNew.match("^(0|\\+381)(([1-3][0-9])|(230)|(280)|(290)|(390))[0-9]{7}$") ? account.phoneNumberNew : account.phoneNumber; 
    account.mobilePhoneNumber = account.mobilePhoneNumberNew !== undefined && account.mobilePhoneNumberNew.match("^(0|\\+381)6[0-69][0-9]{7}$") ? account.mobilePhoneNumberNew : account.mobilePhoneNumber;
    account.deliveryAddress = account.deliveryAddressNew !== undefined && account.deliveryAddressNew.match("^([\u0410-\u0418\u0402\u0408\u041A-\u041F\u0409\u040A\u0420-\u0428\u040B\u040FA-Z\u0110\u017D\u0106\u010C\u0160]{1}[\u0430-\u0438\u0452\u043A-\u043F\u045A\u0459\u0440-\u0448\u0458\u045B\u045Fa-z\u0111\u017E\u0107\u010D\u0161]+\s)+((BB)|(ББ)|([0-9]+[a-z]?))$") ? account.deliveryAddressNew : account.deliveryAddress;
    account.deliveryAddressPAK = account.deliveryAddressPAKNew !== undefined && account.deliveryAddressPAKNew.match("^[0-9]{6}$") ? account.deliveryAddressPAKNew : account.deliveryAddressPAK;
    
    if (account.nameNew === undefined && account.surnameNew === undefined && account.passwordNew === undefined
      && account.emailNew === undefined && account.phoneNumberNew === undefined && account.mobilePhoneNumberNew === undefined
      && account.deliveryAddressNew === undefined && account.deliveryAddressPAKNew === undefined) return;
    //If nothing is changed stop here, otherwise clear all field and procceed to update data  
    account.nameNew = undefined; 
    account.surnameNew = undefined;
    account.passwordNew = undefined;
    account.emailNew = undefined;
    account.phoneNumberNew = undefined;
    account.mobilePhoneNumberNew = undefined;
    account.deliveryAddressNew = undefined;
    account.deliveryAddressPAKNew = undefined;

    this.accountService.updateAccount(account.id, account).then(response => {
      Swal.fire({
        title: "Успешно промењен налог " + account.id,
        text: JSON.stringify(response),
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      console.log(reject);
      Swal.fire({
        title: "Грешка приликом промене података",
        text: "Није могуће променити податке налога. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  deleteAccount(accountId: number): void {
    Swal.fire({
      title: "Потврда уклањања корисничког налога са ИД-јем " + accountId,
      text: "Да ли сте сигурни да желите да уклоните овај налог? Овим ће бити обрисани и сви подаци о поруџбинама и рецензијама овог корисника!",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Да",
      confirmButtonColor: "red",
      cancelButtonText: "Не",
      cancelButtonColor: "green",
      allowOutsideClick: false
    }).then(choice => {
      if (choice.isConfirmed) {
        this.accountService.deleteAccount(accountId).then(() => { //Response will be null
          Swal.fire({
            title: "Успешно уклоњен кориснички налог са ИД-јем " + accountId,
            text: "Заједно са тим су уклоњене све информације о корисниковим поруџбинама из базе",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          }).then(() => {
            this.listAll(); //Refresh all accounts
          });
        }, reject => {
          console.log(reject);
          Swal.fire({
            title: "Грешка приликом уклањања корисника са ИД-јем " + accountId,
            text: "Корисник са ИД-јем " + accountId + " не може бити уклоњен. Проверите да ли су сви потребни Spring REST сервиси активани.",
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        });
      }
    });    
  }

  find(): void {
    Swal.fire({
      title: "Претрага корисничких налога",
      html: "<html><body><span>Унесите ИД корисничког налога:</span><br><input type='number' id='prodavnica-oie-admin-accountId' min='1' class='swal2-input'></body></html>",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Пронађи",
      confirmButtonColor: "green",
      cancelButtonText: "Одустани",
      cancelButtonColor: "red",
      allowOutsideClick: false
    }).then(() => {
      var accountId = (<HTMLInputElement>Swal.getPopup().querySelector("#prodavnica-oie-admin-accountId")).value;
      if (accountId === "") accountId = "-1";
      this.accountService.findAccount(parseInt(accountId)).then(response => {
        if (response != null)
          Swal.fire({
            title: "Пронађени су подаци корисника са ИД-јем " + accountId,
            text: JSON.stringify(response),
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
        else 
          Swal.fire({
            title: "Грешка приликом проналажења корисника",
            text: "Корисник са ИД-јем " + accountId + " се не налази у бази података!",
            icon: "warning",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          });
      }, reject => {
        console.log(reject);
        Swal.fire({
          title: "Грешка приликом проналажења корисника",
          text: "Није могуће пронађи кориснички налог. Проверите да ли је Spring REST сервис активан.",
          icon: "error",
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        });
      })
    });
  }

  showTotal(): void {
    this.accountService.getTotalNumber().then(response => {
      Swal.fire({
        title: "Укупан број корисничких налога је " + response,
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      console.log(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети број корисничких налога. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }

  listAll(): void {
    this.accountService.getListOfAccounts().then(response => {
      this.listedAccounts.data = response;
      this.listedAccounts.sort = this.sort;
      this.listedAccounts.paginator = this.paginator;

      this.pageSizeOptionsSet.clear();
      this.pageSizeOptionsSet.add(1);
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 2));
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 5));
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 8));
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 10));
      this.pageSizeOptionsSet.add(this.listedAccounts.data.length);
      this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);
    }, reject => {
      console.log(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети листу корисничких налога. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  } */

}
