import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../user/auth.service';
import { Subject, Subscription } from 'rxjs';
import { ProductService } from '../Products/product.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CartService } from '../cart/cart.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  items = 0;
  isauthenticated = false;
  userId;
  private authsub: Subscription;
  constructor(private authService: AuthService, private route: Router, public productService: ProductService,
    public router: ActivatedRoute, public cartService: CartService) { }

  ngOnInit() {
    this.isauthenticated = this.authService.getauthstatus();
    this.authsub = this.authService.getauthlistener().subscribe(isauth => {
      this.isauthenticated = isauth;
      this.userId = this.authService.getuserId();
    });
    this.authService.autoAuth();
    this.cartService.getProducts(this.userId);
    this.cartService.productaddedlistener().subscribe((resdata: any) => {
      this.items = parseInt(resdata, 10);
      //console.log(resdata);
    });
    //console.log(this.items);
  }
  searchquery(form: NgForm) {
    if (form.value.searchProduct === '') {
      return;
    }
    let name = form.value.searchProduct;
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    //console.log(name);
    this.productService.searchProduct(name);
  }
  logout() {
    this.authService.logout();
  }
  home() {
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId') || paramMap.has('productId')) {
        this.route.navigate(['/']);
      } else {
        window.location.reload();
      }
    });
  }
  ngOnDestroy() {
    this.authsub.unsubscribe();
  }
}
