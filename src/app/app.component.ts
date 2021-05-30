import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { CryptoService } from './services/crypto/crypto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isDarkMode: Boolean;
  isLoggedIn: Boolean;
  
  constructor(private router: Router,  
    private activatedRoute: ActivatedRoute,  
    private titleService: Title, private cs: CryptoService) { }

  ngOnInit() {
    //Code from: https://www.c-sharpcorner.com/article/angular-dynamic-page-title-based-on-route/
    this.router.events.pipe(  
      filter(event => event instanceof NavigationEnd),  
    ).subscribe(() => {  
      const rt = this.getChild(this.activatedRoute);  
      rt.data.subscribe(data => { this.titleService.setTitle(data.title) });  
    });

    this.isDarkMode = true; /* Initially dark mode is on */
    
    if (localStorage.getItem("isLoggedIn") === null) localStorage.setItem("isLoggedIn", "false");
    this.isLoggedIn = localStorage.getItem("isLoggedIn").includes("true");

    if (!this.isLoggedIn) this.promptAdminLogin();
  }  

  getChild(activatedRoute: ActivatedRoute) {  
    if (activatedRoute.firstChild) return this.getChild(activatedRoute.firstChild);  
    else return activatedRoute; 
  }
  
  onDarkModeChange(e) {
    this.isDarkMode = e.checked;
    document.querySelector("body").classList.remove(!e.checked ? "theme-dark" : "theme-light");
    document.querySelector("body").classList.add(e.checked ? "theme-dark" : "theme-light");
  }

  promptAdminLogin(): void {
    Swal.fire({
      title: "Нисте улоговани!",
      html: "<html><body><span>Улогујте се уносом админ лозинке</span><br><input type='password' id='prodavnica-oie-admin-password' class='swal2-input'></body></html>",
      icon: "warning",
      showCancelButton: false,
      confirmButtonText: "Улогуј ме",
      focusConfirm: false,
      allowOutsideClick: false,
      preConfirm: () => {
        const password = (<HTMLInputElement>Swal.getPopup().querySelector("#prodavnica-oie-admin-password")).value;
        const encriptionKey = "8fefa3caea331537a156a114299d5b60ff96a9c5e2e34b824ccfc4fb3d33e3bc6cc34486365e15c4885870da648505e7cc9f957b7383e2a421e766c113f47f0c";

        if (this.cs.encrypt(encriptionKey, password).includes("GaMV5L/RSmu1ebZJH1b0Zl2R/ygEOlAO3MKRuJ3OTXg=")) Swal.resetValidationMessage();
        else Swal.showValidationMessage("Унета лозинка за админ налог није исправна!"); //Password is: prodavnicatestadmin123456
     
        return { info: "Успешно сте се улоговали као админ" }
      }
    }).then((result) => {
      localStorage.setItem("isLoggedIn", "true");
      Swal.fire(`${result.value.info}`.trim(), "", "success");
    })
  }

  logout(): void {
    localStorage.setItem("isLoggedIn", "false");
    window.location.reload();
  }
}