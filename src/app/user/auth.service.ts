import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { User } from './user.model';
import { environment } from 'src/environments/environment';
const BACKEND_URL = environment.apiUrl + "/user/";
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token;
  private userId: string;
  private authstatus = false;
  private tokentimer: any;
  private name: string;
  private authStatusListener = new Subject<boolean>();
  constructor(private router: Router, private http: HttpClient) { }

  login(username: string, pass: string) {
    const authData = { email: username, password: pass };
    //console.log("in service");
    this.http.post<{
      token: string, message: string,
      expiresIn: number, userId: string, name: string
    }>(
      BACKEND_URL + 'login', authData
    ).subscribe(resdata => {
      console.log(resdata);
      this.token = resdata.token;
      if (resdata.message !== 'success') {
        alert(resdata.message);
        return;
      }
      if (this.token) {
        //console.log("in if");
        const expireInDuration = resdata.expiresIn;
        console.log(expireInDuration);
        this.authTimer(expireInDuration);
        this.authstatus = true;
        this.authStatusListener.next(true);
        this.userId = resdata.userId;
        const now = new Date();
        const expirationDate = new Date(now.getTime() + expireInDuration * 1000);
        this.name = resdata.name;
        this.saveauthstatus(this.token, expirationDate, this.userId, this.name);
        console.log(expirationDate);
        this.router.navigate(['/']);
      }
    })
  }

  signup(name: string, username: string, password: string) {
    const user = {
      name: name,
      email: username,
      password: password
    };
    console.log(user);
    this.http.post(BACKEND_URL + 'signup', user).subscribe(resdata => {
      console.log(resdata);
    });
    this.router.navigate(["/login"]);
  }

  autoAuth() {
    const authinfo = this.getAuthData();
    if (!authinfo) {
      return;
    }
    const now = new Date();
    const expiresIn = authinfo.expirationData.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authinfo.token;
      this.authstatus = true;
      this.name = authinfo.name;
      this.userId = authinfo.userId;
      this.authTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private authTimer(duration: number) {
    this.tokentimer = setTimeout(() => { this.logout(); }, duration * 1000);
  }

  logout() {
    this.token = null;
    this.authstatus = false;
    this.name = null;
    this.authStatusListener.next(false);
    clearTimeout(this.tokentimer);
    this.clearAuthData();
    this.userId = null;
    window.location.reload();
  }

  gettoken() {
    return this.token;
  }

  getuserId() {
    return this.userId;
  }

  getname() {
    return this.name;
  }

  getauthstatus() {
    return this.authstatus;
  }

  getauthlistener() {
    return this.authStatusListener.asObservable();
  }

  private saveauthstatus(token: string, expirationDate: Date, userId: string, name: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('name', name);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('name');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationData = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const name = localStorage.getItem('name');
    if (!token || !expirationData) {
      return;
    }
    return {
      token: token,
      expirationData: new Date(expirationData),
      userId: userId,
      name: name
    };
  }

  getUser(id: string) {
    return this.http.get<{ user: User }>(
      BACKEND_URL + 'signup' + id);
  }

  userEdit(id: string, name: string, username: string, password: string) {
    const user = {
      _id: id,
      name: name,
      email: username,
      password: password
    }
    //console.log(user);
    this.http.put<{ message: string, result: any }>(BACKEND_URL + 'edit', user).subscribe(res => {
      //console.log(res.message, res.result);
      console.log('changes saved');
      this.router.navigate(['/']);
    });
  }

  deleteAcc(userId: string) {
    this.http.delete<{ message: string }>(BACKEND_URL + 'delete' + userId).subscribe(res => {
      //console.log(res.message);
      this.logout();
    });
  }


  cancelorder(product, id) {
    return this.http.put(BACKEND_URL + 'cancelorder' + id, product);
  }

  placeorder(id: string, product: any) {
    //console.log(id);
    this.http.put<{ sucess: string }>(BACKEND_URL + 'order' + id, product).subscribe(res => {
      //console.log(res);
      if (res.sucess === 'succes') {
        alert('order placed successfully');
        this.router.navigate(['/']);
      } else {
        alert('order not placed please retry after sometime');
        this.router.navigate(['/']);
      }
    });
  }

}
