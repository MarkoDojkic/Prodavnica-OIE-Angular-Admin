import { observable, Observable } from 'rxjs';
import { CryptoService } from 'src/app/services/crypto/crypto.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private cryptoService: CryptoService, private router: Router) { }
  
  canActivate(): Observable<boolean> {
    return new Observable<boolean>((observable) => {
      const openIDB = window.indexedDB.open("prodavnica-oie-admin", 1);

      openIDB.onupgradeneeded = () => openIDB.result.createObjectStore("authData");

      openIDB.onsuccess = () => {
        const getAuthKey = openIDB.result.transaction("authData", "readonly").objectStore("authData").get("key_0");

        getAuthKey.onsuccess = () => {
          if (getAuthKey.result === undefined) {
            this.promptAdminLogin();
            return observable.next(false);
          }
          const decryptedAuthKey = this.cryptoService.decrypt("75264342634FA64774365B842D7426567A7961427A622373576778562243D6577729322654314281743A041661253989750945F7636234431354789139552559423D24447523047512B34842666745448D457463237656576393256D3488642E0367264BA682177F5544667264A234BF45647842877A51571933614D45714764449750074FDB56456235A716744E523446E66F22332675714486268434676249756233A6658877632B16272544327615687B463755528163637520D172B28243625274556343326866DB763826492A5976F6649603A9452554E957A3752A54677430994D563344E8484523437B61785024F0472B2E4A26436623413B22F6283472D4B77402677384242222353E5357734563A6450E382473582653245A73A322565543E34B3546E1D6374576922B41B2622EAB734D15571D5724059D66525592816A43D3246A5516514A95528A8353A454243B08553627542615665766922758F4067048651733442F4E44574367473674263777755874677467A52732752466882753967750372A6765A4456659A675547677434576A236EA27373BB5B3377266838A2263E544575364A5191257A63664DE522E824671256D6FB564906726AD90850477AA6516531375643655368737A97557484644418435262BA4747524432273F666DB75F44086425654A763F2368645394278353654574D5A5D5D4D2265", getAuthKey.result);

          if (parseInt(Date.now().toString()) - parseInt(decryptedAuthKey) > 7200000) {
            this.promptAdminLogin();
            observable.next(false);
          } else observable.next(true);
        }

        getAuthKey.onerror = () => { this.promptAdminLogin(); observable.next(false); };
      }

      openIDB.onerror = () => { this.promptAdminLogin(); observable.next(false); };
    });
  }

  private promptAdminLogin(): void {
    if (this.router.url != "/") {
      this.router.navigate([""]);
      return;
    }

    Swal.fire({
      title: "Нисте улоговани!",
      html: `<html><body>
              <span>Улогујте се уносом админ лозинке</span><br>
              <input type='password' id='prodavnica-oie-admin-password'
              class='swal2-input'>
            </body></html>`,
      icon: "warning",
      showCancelButton: false,
      confirmButtonText: "Улогуј ме",
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const password = (<HTMLInputElement>Swal.getPopup().querySelector("#prodavnica-oie-admin-password")).value;
        const encriptionKey = "8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c";

        if (this.cryptoService.encrypt(encriptionKey, password).includes("GaMV5L/RSmu1ebZJH1b0Zl2R/ygEOlAO3MKRuJ3OTXg=")) {
          const openIDB = window.indexedDB.open("prodavnica-oie-admin", 1);

          openIDB.onsuccess = () => {
            const newKey = this.cryptoService.encrypt("75264342634FA64774365B842D7426567A7961427A622373576778562243D6577729322654314281743A041661253989750945F7636234431354789139552559423D24447523047512B34842666745448D457463237656576393256D3488642E0367264BA682177F5544667264A234BF45647842877A51571933614D45714764449750074FDB56456235A716744E523446E66F22332675714486268434676249756233A6658877632B16272544327615687B463755528163637520D172B28243625274556343326866DB763826492A5976F6649603A9452554E957A3752A54677430994D563344E8484523437B61785024F0472B2E4A26436623413B22F6283472D4B77402677384242222353E5357734563A6450E382473582653245A73A322565543E34B3546E1D6374576922B41B2622EAB734D15571D5724059D66525592816A43D3246A5516514A95528A8353A454243B08553627542615665766922758F4067048651733442F4E44574367473674263777755874677467A52732752466882753967750372A6765A4456659A675547677434576A236EA27373BB5B3377266838A2263E544575364A5191257A63664DE522E824671256D6FB564906726AD90850477AA6516531375643655368737A97557484644418435262BA4747524432273F666DB75F44086425654A763F2368645394278353654574D5A5D5D4D2265", Date.now().toString());

            const putAuthKey = openIDB.result.transaction("authData", "readwrite").objectStore("authData").put(newKey, "key_0");

            putAuthKey.onsuccess = () => Swal.resetValidationMessage();

            putAuthKey.onerror = () => Swal.showValidationMessage("Грешка на серверу! Покушајте поново!");
          }

          openIDB.onerror = () => Swal.showValidationMessage("Грешка на серверу! Покушајте поново!");
        } else Swal.showValidationMessage("Унета лозинка за админ налог није исправна!"); //Password is: prodavnicatestadmin123456
     
        return { info: "Успешно сте се улоговали као админ" }
      }
    }).then((result) => {
      this.router.navigate(["products"]);
      Swal.fire(`${result.value.info}`.trim(), "", "success");
    });
  }
}