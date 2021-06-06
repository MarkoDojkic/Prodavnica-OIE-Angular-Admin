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

  isDarkMode: boolean;
  isLoggedIn: boolean;
  
  constructor(private router: Router,  
    private activatedRoute: ActivatedRoute,  
    private titleService: Title, private cryptoService: CryptoService) { }

  ngOnInit() {
    //Code from: https://www.c-sharpcorner.com/article/angular-dynamic-page-title-based-on-route/
    this.router.events.pipe(  
      filter(event => event instanceof NavigationEnd),  
    ).subscribe(() => {  
      const rt = this.getChild(this.activatedRoute);  
      rt.data.subscribe(data => { this.titleService.setTitle(data.title) });  
    });

    this.isDarkMode = true; /* Initially dark mode is on */
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

  logout(): void {
    const openIDB = window.indexedDB.open("prodavnica-oie-admin", 1);
    openIDB.onsuccess = () => openIDB.result.transaction("authData", "readwrite").objectStore("authData").clear();
    window.location.reload();
  }
}