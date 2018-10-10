import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../user.service";
import { AuthModel } from "../auth.model";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  isLoading = false;

  constructor(public userService: UserService) {}

  onSubmit(signupForm: NgForm) {
    const user: AuthModel =  {
      email: signupForm.value.email,
      password: signupForm.value.password
    };
    this.userService.login(user);
  }
}
