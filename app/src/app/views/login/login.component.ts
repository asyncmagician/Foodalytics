import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthentificationService} from 'src/app/services/authentification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  form: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthentificationService,
    private router: Router
  ) {
  }

  onLogin() {
    if (this.form.valid) {
      this.auth.login(this.form.value).subscribe(success => {
        if (success) {
          this.router.navigateByUrl('/accueil');
        } else {
          alert("Mauvais login / mot de passe")
        }
      });
    }
  }
}
