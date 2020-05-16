import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from '../user/auth.service';
import { ProductService } from '../Products/product.service';
import { Product } from '../Products/product.model';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.css']
})
export class BuyComponent implements OnInit {

  userId;

  product: Product;
  isLoading = false;
  constructor(public route: ActivatedRoute, public productService: ProductService,
    public authService: AuthService, public router: Router, public http: HttpClient) { }

  ngOnInit() {
    this.userId = this.authService.getuserId();

    this.route.paramMap.subscribe((paraMap: ParamMap) => {
      if (paraMap.has('productId')) {
        this.isLoading = true;
        const pid = paraMap.get('productId');
        this.productService.getproduct(pid).subscribe(result => {

          //console.log(result.product);
          this.product = {
            name: result.product.name,
            discription: result.product.discription,
            image: result.product.image,
            price: result.product.price,
            _id: result.product._id,
            seller_id: result.product.seller_id,
            sellername: result.product.sellername
          }

        });
        this.isLoading = false;
      }
    });

  }

  placeorder() {
    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      this.userId = this.authService.getuserId();
      //console.log(this.userId);
      this.authService.placeorder(this.userId, this.product);
    }

  }
}
