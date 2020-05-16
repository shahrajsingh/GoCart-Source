import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../user/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + "/user/";
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  orders = [];
  isloading = false;
  d = new Date();
  date;
  constructor(public http: HttpClient, public authService: AuthService, public router: Router) { }

  ngOnInit() {
    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      this.date = this.d.getDate() + '-' + (this.d.getMonth() + 1) + '-' + this.d.getFullYear();
      this.isloading = true;
      const id = this.authService.getuserId();
      this.http.get<{ pid: any }>(BACKEND_URL + 'orders' + id).subscribe((result: any) => {
        this.orders = result.pid;
        this.isloading = false;
      });
    }

  }
  delete(product) {
    if (!this.authService.getauthstatus()) {
      this.router.navigate(['/login']);
    } else {
      this.isloading = true;
      const id = this.authService.getuserId();
      this.authService.cancelorder(product, id).subscribe(res => {
        //console.log(res);
        this.isloading = false;
      });
      this.orders = [];
      this.isloading = true;
      this.http.get<{ pid: any }>(BACKEND_URL + 'orders' + id).subscribe((result: any) => {
        this.orders = result.pid;
        this.isloading = false;
      });
    }
  }

}
