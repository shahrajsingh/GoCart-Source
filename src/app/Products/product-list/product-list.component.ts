import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/user/auth.service';
import { CartService } from 'src/app/cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  mode = 'list';
  products: Product[] = [];
  private productsub = new Subscription();
  isLoading = false;
  totalproducts = 0;
  postsperpage = 8;
  currentpage = 1;
  pagesizeoptions = [4, 8, 16, 32];
  userid;
  constructor(private productService: ProductService, public route: ActivatedRoute,
    public authService: AuthService, public cartService: CartService, public router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        //console.log(this.mode);
        this.mode = 'listspec';
        this.userid = paramMap.get('userId');
        this.isLoading = true;
        this.productService.getProducts(this.postsperpage, 1, this.userid);
        this.productsub = this.productService.productUpdateListener().subscribe(
          (productdata: { product: Product[], productcount: number }) => {
            this.products = productdata.product;
            this.totalproducts = productdata.productcount;
            //console.log(this.totalproducts);
            this.isLoading = false;
          });
      } else if (paramMap.has('productId')) {
        this.mode = 'details';
        this.isLoading = true;
        const id = paramMap.get('productId');
        this.productService.getproduct(id).subscribe((res) => {
          this.products = [];
          this.products.push(res.product);
          //console.log(this.products);
          this.isLoading = false;
        });
      } else {

        this.products = [];
        this.authService.autoAuth();
        this.isLoading = true;
        this.productService.getProduct(this.postsperpage, 1);
        this.productsub = this.productService.productUpdateListener().subscribe(
          (productdata: { product: Product[], productcount: number }) => {
            this.products = productdata.product;
            this.totalproducts = productdata.productcount;
            //console.log(this.totalproducts);
            this.isLoading = false;
          });
      }
    });
  }

  onchangepage(page: PageEvent) {
    this.isLoading = true;
    this.currentpage = page.pageIndex + 1;
    this.postsperpage = page.pageSize;
    this.productService.getProduct(this.postsperpage, this.currentpage);


  }
  addtocart(product: Product) {

    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      const id = this.authService.getuserId();
      this.cartService.addToCart(product, id);
    }

  }

  buy() {
    const id = this.authService.getuserId();
    if (id === null || id === '') {
      this.router.navigate(['/login']);
    } else {
      //this.cartService.getProducts(id);
    }
  }
  delete(id: string) {
    this.productService.delete(id);
  }
  ngOnDestroy() {
    this.productsub.unsubscribe();
  }

}
