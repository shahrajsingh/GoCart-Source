import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './Products/product-list/product-list.component';
import { LoginComponent } from './user/login/login.component';
import { SignupComponent } from './user/signup/signup.component';
import { CartComponent } from './cart/cart.component';
import { ProductCreateComponent } from './Products/product-create/product-create.component';
import { AuthGurad } from './user/auth-guard';
import { OrderComponent } from './order/order.component';
import { BuyComponent } from './buy/buy.component';


const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'cart', component: CartComponent },
  { path: 'create', component: ProductCreateComponent,  },
  { path: 'signup/:userId', component: SignupComponent },
  { path: 'list/:userId', component: ProductListComponent,  },
  { path: 'edit/:productId', component: ProductCreateComponent,  },
  { path: 'buy/:productId', component: CartComponent },
  { path: 'orders', component: OrderComponent,  },
  { path: 'cart/:productId', component: BuyComponent },
  { path: 'details/:productId', component: ProductListComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGurad]
})
export class AppRoutingModule { }
