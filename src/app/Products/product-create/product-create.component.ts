import { Component, OnInit } from '@angular/core';
import { Product } from '../product.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../product.service';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/user/auth.service';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit {
  mode = 'create';
  private userId;
  productId;
  public product: Product = {
    _id: null,
    name: null,
    discription: null,
    price: null,
    image: null,
    seller_id: null,
    sellername: null
  };
  public isLoading = false;
  createProduct: FormGroup;
  imgprev;
  constructor(private router: Router,
    private authService: AuthService,
    public poductService: ProductService,
    public route: ActivatedRoute) { }

  ngOnInit() {
    this.createProduct = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      discription: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      img: new FormControl(null, { validators: [Validators.required] }),
      price: new FormControl(null, { validators: [Validators.required] })
    });
    this.userId = this.authService.getuserId();
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        //console.log(this.mode);
        this.productId = paramMap.get('productId');
        this.isLoading = true;
        this.poductService.getproduct(this.productId).subscribe((productdata) => {
          this.isLoading = false;
          //console.log(productdata);
          this.product = {
            _id: productdata.product._id,
            name: productdata.product.name,
            discription: productdata.product.discription,
            image: productdata.product.image,
            seller_id: productdata.product.seller_id,
            price: productdata.product.price,
            sellername: productdata.product.sellername
          };
          //console.log(this.product);
          this.createProduct.setValue({
            name: this.product.name,
            discription: this.product.discription,
            img: this.product.image,
            price: this.product.price
          });
        });
      }
    });
  }

  CreateProduct() {
    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      const name = this.authService.getname();
      if (this.createProduct.invalid) {
        return;
      } else if (this.mode === 'create') {
        this.isLoading = true;
        this.poductService.createProduct(this.createProduct.value.name, this.createProduct.value.discription,
          this.createProduct.value.img, this.createProduct.value.price, this.userId, name);
      } else {
        this.poductService.updateProduct(this.product._id, this.createProduct.value.name, this.createProduct.value.discription,
          this.createProduct.value.img, this.createProduct.value.price, this.product.seller_id, name);
      }
      this.createProduct.reset();
    }
  }

  onimagepick(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];
    this.createProduct.patchValue({ img: image });
    this.createProduct.get('img').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imgprev = reader.result;
    };
    reader.readAsDataURL(image);
  }


}
