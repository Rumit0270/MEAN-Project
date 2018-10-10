import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UserService } from "../user.service";
import { AuthModel } from "../auth.model";

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  isLoading = false;

  constructor(public userService: UserService) {}


  onSubmit(signupForm: NgForm) {

    this.isLoading = true;
    const user: AuthModel =  {
      email: signupForm.value.email,
      password: signupForm.value.password
    };
    this.userService.signUp(user);
  }
}
