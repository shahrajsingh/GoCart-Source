import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { User } from '../user.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  public mode = 'create';
  userId;
  isloading = false;
  user: User = {
    _id: null,
    name: null,
    email: null,
    password: null,
  };
  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        if (!this.authService.getauthstatus()) {
          this.router.navigate(['/login']);
        } else {
          this.mode = 'edit';
          //console.log(this.mode);
          this.userId = paramMap.get('userId');
          this.isloading = true;
          this.authService.getUser(this.userId).subscribe((res) => {
            //console.log(res);
            this.user = {
              _id: res.user._id,
              name: res.user.name,
              email: res.user.email,
              password: res.user.password
            }
            //console.log(this.user);
          });
        }
      }
    });
  }
  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    let acount = 0;
    let ncount = 0;
    const pass = form.value.password;
    for (let a = 0; a < pass.length; a++) {
      const c = pass.charAt(a);
      if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z')) {
        acount++;
      }
      if ((c >= '0' && c <= '9')) {
        ncount++;
      }
    }
    if (acount <= 0 || ncount <= 0 || form.value.password.length < 8) {
      alert('password must be alphanumeric e.g:-123ABc and minimum 8 characters long');
      return;
    } else {
      if (this.mode === 'create') {
        //console.log(form.value.name, form.value.email, form.value.password);
        this.authService.signup(form.value.name, form.value.email, form.value.password);
      } else {
        //console.log(form.value.password);
        this.authService.userEdit(this.user._id, form.value.name, form.value.email, form.value.password);
      }
    }


  }
  delete() {
    if (confirm('Warning!!!.You are about delete your account')) {
      this.authService.deleteAcc(this.userId);
    } else {
      return;
    }

  }

}
