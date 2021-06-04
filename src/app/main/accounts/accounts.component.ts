import { CryptoService } from './../../services/crypto/crypto.service';
import { FormGroup, NgForm, NgModel } from '@angular/forms';
import { AccountService } from './../../services/account/account.service';
import { Account } from './../../model/account';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  listedAccounts = new MatTableDataSource<Account>();
  displayedColumns: Array<string> = ["name","surname","email","password","phoneNumber","mobilePhoneNumber","deliveryAddress","deliveryAddressPAK", "actions"];
  pageSizeOptionsSet: Set<number> = new Set<number>();
  pageSizeOptions: Array<number>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private cs: CryptoService,private accountService: AccountService) { }

  ngOnInit(): void { }

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
      }).then(() => window.location.reload());
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом додавања новог корисника",
        text: "Није могуће додати кориснички налог. Проверите да ли је Spring REST сервис активан, а ако јесте онда се неки подаци већ налазе у бази за други или исти налог.",
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
    return isAllValid && !form.controls["passwordRepeat"]?.hasError("matched");
  }

  editAccount(account: Account): void {

    account.passwordNew = account.passwordNew !== undefined && account.passwordNew.length >= 8 ? this.cs.encryptSHA256("8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c", account.passwordNew) : undefined;

    account.name = account.nameNew !== undefined && account.nameNew.match("^[\u0410-\u0418\u0402\u0408\u041A-\u041F\u0409\u040A\u0420-\u0428\u040B\u040FA-Z\u0110\u017D\u0106\u010C\u0160]{1}[\u0430-\u0438\u0452\u043A-\u043F\u045A\u0459\u0440-\u0448\u0458\u045B\u045Fa-z\u0111\u017E\u0107\u010D\u0161]+$") ? account.nameNew : account.name;
    account.surname = account.surnameNew !== undefined && account.surnameNew.match("^([\u0410-\u0418\u0402\u0408\u041A-\u041F\u0409\u040A\u0420-\u0428\u040B\u040FA-Z\u0110\u017D\u0106\u010C\u0160]{1}[\u0430-\u0438\u0452\u043A-\u043F\u045A\u0459\u0440-\u0448\u0458\u045B\u045Fa-z\u0111\u017E\u0107\u010D\u0161]+(\s|\-)?)+$") ? account.surnameNew : account.surname;
    account.email  = account.emailNew !== undefined && account.emailNew.match("^([a-z0-9_.-]+)@([\da-z.-]+)\.([a-z.]{2,6})$") ? account.emailNew : account.email;
    account.password_hash = account.passwordNew !== undefined ? account.passwordNew : account.password_hash; 
    account.phoneNumber = account.phoneNumberNew !== undefined && account.phoneNumberNew.match("^(0|\\+381)(([1-3][0-9])|(230)|(280)|(290)|(390))[0-9]{7}$") ? account.phoneNumberNew : account.phoneNumber; 
    account.mobilePhoneNumber = account.mobilePhoneNumberNew !== undefined && account.mobilePhoneNumberNew.match("^(0|\\+381)6[0-69][0-9]{7}$") ? account.mobilePhoneNumberNew : account.mobilePhoneNumber;
    account.deliveryAddress = account.deliveryAddressNew !== undefined && account.deliveryAddressNew.match("^([\u0410-\u0418\u0402\u0408\u041A-\u041F\u0409\u040A\u0420-\u0428\u040B\u040FA-Z\u0110\u017D\u0106\u010C\u0160]{1}[\u0430-\u0438\u0452\u043A-\u043F\u045A\u0459\u0440-\u0448\u0458\u045B\u045Fa-z\u0111\u017E\u0107\u010D\u0161]+\s)+((BB)|(ББ)|([0-9]+[a-z]?))$") ? account.deliveryAddressNew : account.deliveryAddress;
    account.deliveryAddressPAK = account.deliveryAddressPAKNew !== undefined && account.deliveryAddressPAKNew.match("^[0-9]{6}$") ? account.deliveryAddressPAKNew : account.deliveryAddressPAK;
    
    if (account.name !== account.nameNew && account.surname !== account.surnameNew
      && account.email !== account.emailNew && account.passwordNew === undefined 
      && account.phoneNumber !== account.phoneNumberNew && account.mobilePhoneNumber !== account.mobilePhoneNumberNew
      && account.deliveryAddress !== account.deliveryAddressNew && account.deliveryAddressPAK !== account.deliveryAddressPAKNew)
      return; //If nothing is changed stop here, otherwise clear all fields and procceed to update data
    delete account.nameNew; //Removing not needed property
    delete account.surnameNew; //Removing not needed property
    delete account.passwordNew; //Removing not needed property
    delete account.emailNew; //Removing not needed property
    delete account.phoneNumberNew; //Removing not needed property
    delete account.mobilePhoneNumberNew; //Removing not needed property
    delete account.deliveryAddressNew; //Removing not needed property
    delete account.deliveryAddressPAKNew; //Removing not needed property

    this.accountService.updateAccount(account.id, account).then(response => {
      if (response !== null) {
        Swal.fire({
          title: "Успешно промењен налог " + account.id,
          icon: "success",
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        }).then(() => this.listAll());
      }
    }, reject => {
      //console.log(reject);
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
      text: "Да ли сте сигурни да желите да уклоните овај налог? Овим ће бити обрисани и сви подаци о поруџбинама и рецензијама овог корисника.",
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
            text: "Заједно са тим су уклоњене све информације о корисниковим поруџбинама из базе.",
            icon: "success",
            showCancelButton: false,
            confirmButtonText: "У реду",
            allowOutsideClick: false
          }).then(() => {
            this.listAll(); //Refresh all accounts
          });
        }, reject => {
          //console.log(reject);
          Swal.fire({
            title: "Грешка приликом уклањања корисника са ИД-јем " + accountId,
            text: "Корисник са ИД-јем " + accountId + " не може бити уклоњен. Проверите да ли су сви потребни Spring REST сервиси активни.",
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
      html: `<html><body>
              <span>Унесите ИД корисничког налога:</span><br>
              <input type='number' id='prodavnica-oie-admin-accountId' min='1'
              class='swal2-input'>
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
          //console.log(reject);
          Swal.fire({
            title: "Грешка приликом проналажења корисника",
            text: "Није могуће пронађи кориснички налог. Проверите да ли је Spring REST сервис активан.",
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
    this.accountService.getTotalNumber().then(response => {
      var message: string = "";
      if (response === 0) message = "У бази се не налази ниједан кориснички налог";
      else message = "Укупан број корисничких налога је " + response;

      Swal.fire({
        title: message,
        icon: "info",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети укупан број корисничких налога. Проверите да ли је Spring REST сервис активан.",
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
      
      if (this.listedAccounts.data.length === 0) { //No accounts found
        Swal.fire({
          title: "Није пронађен ниједан кориснички налог у бази",
          icon: "info",
          showCancelButton: false,
          confirmButtonText: "У реду",
          allowOutsideClick: false
        });
        return;
      }

      this.pageSizeOptionsSet.add(1);
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 2));
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 5));
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 8));
      this.pageSizeOptionsSet.add(Math.floor(this.listedAccounts.data.length / 10));
      this.pageSizeOptionsSet.add(this.listedAccounts.data.length);
      this.pageSizeOptions = Array.from(this.pageSizeOptionsSet);

      Swal.fire({
        title: "Подаци о корисничким налозима су успешно учитани",
        icon: "success",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    }, reject => {
      //console.log(reject);
      Swal.fire({
        title: "Грешка приликом преузимања података",
        text: "Није могуће преузети листу корисничких налога. Проверите да ли је Spring REST сервис активан.",
        icon: "error",
        showCancelButton: false,
        confirmButtonText: "У реду",
        allowOutsideClick: false
      });
    });
  }
}
