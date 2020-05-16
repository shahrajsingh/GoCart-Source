import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { AuthService } from '../user/auth.service';
import { Product } from '../Products/product.model';
import { CartService } from './cart.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  isloading = false;

  products: Product[] = [];
  price;
  cartSub = new Subscription();
  constructor(private router: Router, private route: ActivatedRoute, public authService: AuthService, public cartService: CartService) {
  }

  ngOnInit() {
    const id = this.authService.getuserId();
    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      this.isloading = true;
      this.cartService.getProducts(id);
      this.cartService.cartUpdatedListener().subscribe((data: { product: Product[], price: number }) => {
        this.products = data.product;
        this.price = data.price;
        this.isloading = false;
        //console.log(this.price);
      });

    }

  }
  placeorder() {
    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      const id = this.authService.getuserId();
      this.cartService.placeorder(id);
    }
  }
  delete(product) {
    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      this.isloading = true;
      //console.log(this.products);
      const id = this.authService.getuserId();
      this.cartService.delete(product, id).subscribe(result=>{
        this.cartService.getProducts(id);
        this.isloading = false;
      });
    }
  }
}
