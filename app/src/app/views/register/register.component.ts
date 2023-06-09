import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup = this.formBuilder.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit() {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;
      this.http.post('http://localhost:3000/users', formData).subscribe({
        next: (response) => {
          this.router.navigate(['/accueil'], { queryParams: { successMessage: 'Inscription réussie !' } });
        },
        error: (error) => {
          this.router.navigate(['/inscription'], {
            queryParams: { errorMessage: `Une erreur s'est produite, veuillez réessayer. (${error.message})` }
          });
        }
      });
    }
  }
}
