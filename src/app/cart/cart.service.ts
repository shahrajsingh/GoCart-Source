import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Product } from '../Products/product.model';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + '/user/';
@Injectable({
  providedIn: 'root'
})
export class CartService {
  products = [];
  length = 0;
  productadded = new Subject();
  productUpdatedListener = new Subject<{ product: Product[], price: number }>();
  constructor(private http: HttpClient, private route: Router) { }

  addToCart(product, id: string) {
    this.http.put(BACKEND_URL + 'tocart' + id, product).subscribe(resdata => {
     // console.log(resdata);
    });

    this.length += 1;

    this.productadded.next(this.length);

  }
  getProducts(id: string) {

    this.http.get<{ pid: Product[], price: number }>(BACKEND_URL + 'getcart' + id).subscribe(resdata => {
      this.products = resdata.pid;
     // console.log(resdata.pid);
      //console.log(this.products);
      this.length = this.products.length;
      this.productadded.next(this.length);
      this.productUpdatedListener.next({ product: [...this.products], price: resdata.price });
    });
  }
  getProduct(id) {

  }
  productaddedlistener() {
    return this.productadded.asObservable();
  }
  cartUpdatedListener() {
    return this.productUpdatedListener.asObservable();
  }

  placeorder(id: string) {

    this.products.forEach(element => {

      this.http.put(BACKEND_URL + 'order' + id, element).subscribe(res => {
        //console.log(res);
      });
      this.http.put(BACKEND_URL + 'pull' + id, element).subscribe(res => {
        console.log(res);
      });

    });
    alert('order placed successfully');
    this.getProducts(id);
    this.route.navigate(['/']);
  }

  delete(product, id) {
    this.products = null;
    this.length -= 1;
    this.productadded.next(this.length);
    return this.http.put(BACKEND_URL + 'cartpull' + id, product);
  }

}
