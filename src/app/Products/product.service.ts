import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from './product.model';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + '/product/';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [];
  private productUpdated = new Subject<{ product: Product[], productcount: number }>();
  constructor(private http: HttpClient, private route: Router) { }

  createProduct(name: string, discription: string, img: any, price, SellerId: string, sellername: string) {
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);

    const product = new FormData();
    product.append('name', name);
    product.append('image', img, name);
    product.append('discription', discription);
    product.append('price', price);
    product.append('seller_id', SellerId);
    product.append('sellername', sellername);
    //console.log(product);
    this.http.post(BACKEND_URL + 'post', product).subscribe(res => {
      //console.log(res);
      alert('Product save succesfully');
    });
    this.route.navigate(['/']);
  }

  getproduct(id: string) {
    return this.http.get<{
      product: Product
    }>(BACKEND_URL + 'edit' + id);
  }

  getProduct(postsperpage: number, currentpage: number) {
    const queryparams = `?pagesize=${postsperpage}&page=${currentpage}`;
    this.http.get<{ product: Product[], count: number }>(BACKEND_URL + 'get' + queryparams).subscribe(res => {

      this.products = res.product;
      this.productUpdated.next({ product: [...this.products], productcount: res.count });
    });
  }

  getProducts(postsperpage: number, currentpage: number, uesrid: string) {
    const queryparams = `?pagesize=${postsperpage}&page=${currentpage}`;
    this.http.get<{ product: Product[], count: number }>(BACKEND_URL + 'get' + uesrid + queryparams).subscribe(res => {
      this.products = res.product;
      this.productUpdated.next({ product: [...this.products], productcount: this.products.length });
    });
  }
  updateProduct(id: string, name: string, discription: string, image: File | string, price, SellerId: string, sellername: string) {
    /*console.log(id, Name, Discription, image, Price, SellerId);
    let productdata: Product | FormData;
    if (typeof (image) === 'object') {
      console.log('obj');
      productdata = new FormData();
      productdata.append('_id', id);
      productdata.append('name', Name);
      productdata.append('image', image, Name);
      productdata.append('discription', Discription);
      productdata.append('price', Price);
      productdata.append('seller_id', SellerId);
    } else {
      console.log('nobj');
      productdata = {
        _id: id,
        name: Name,
        discription: Discription,
        image: image,
        price: Price,
        seller_id: SellerId
      };
    }
    console.log(productdata);*/
    name = name.toLowerCase();
    name = name.charAt(0).toUpperCase() + name.slice(1);
    let product: Product | FormData;
    if (typeof (image) === 'object') {
      product = new FormData();
      product.append('_id', id);
      product.append('name', name);
      product.append('image', image, name);
      product.append('discription', discription);
      product.append('price', price);
      product.append('seller_id', SellerId);
    } else {
      product = {
        _id: id,
        name: name,
        discription: discription,
        image: image,
        price: price,
        seller_id: SellerId,
        sellername: sellername
      };
    }

    this.http.put(BACKEND_URL + 'editproduct' + id, product)
      .subscribe((response) => {
        //console.log(response);
        this.route.navigate(['/']);
      });
  }
  searchProduct(queryparams: string) {
    this.http.get<{ product: Product[] }>(BACKEND_URL + 'search' + queryparams).subscribe(res => {
      this.products = res.product;
      const count = this.products.length;
      this.productUpdated.next({ product: [...this.products], productcount: count });
    });
  }

  productUpdateListener() {
    return this.productUpdated.asObservable();
  }

  delete(id: string) {
    this.http.delete(BACKEND_URL + 'delete' + id).subscribe(res => {
      this.route.navigate(['/']);
    });
  }
}
