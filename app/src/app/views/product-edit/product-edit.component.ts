import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Food } from "../../models/Food";
import { Jwt } from "../../models/Jwt";
import { AuthentificationService } from "../../services/authentification.service";

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss'],
})
export class ProductEditComponent {
  form: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    calories: [0, [Validators.required]],
    lipids: [0, [Validators.required]],
    carbohydates: [0, [Validators.required]],
    proteins: [0, [Validators.required]],
    img: []
  });

  jwt: Jwt | null = null;

  foodModified?: Food;
  selectedFile: File | null = null;
  imageSource: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthentificationService
  ) {
    this.auth.$jwt.subscribe((jwt) => (this.jwt = jwt));
    this.route.params.subscribe((params) => {
      if (params['id'] !== undefined && this.jwt) {
        this.http
          .get<any>('http://localhost:3000/foods/' + params['id'], {
            headers: {
              'Authorization': 'Bearer ' + this.jwt.token
            }
          })
          .subscribe({
            next: (response) => {
              const food: Food = response.body.data;
              this.form.patchValue(food);
              this.foodModified = food;

              if (food) {
                this.imageSource = 'http://localhost:3000/' + food.img;
              }
            },
            error: (response) => alert(response.error.message),
          });
      }
    });
  }

  onSelectImage(file: File | null) {
    this.selectedFile = file;
  }

  onFoodAdd() {
    if (this.form.valid && this.jwt) {
      if (this.foodModified) {
        if (this.selectedFile) {
          this.form.value.img = this.selectedFile;
        }

        this.http
          .put(
            'http://localhost:3000/foods/' + this.foodModified.id,
            this.form.value,
            {
              headers: {
                'Authorization': 'Bearer ' + this.jwt.token
              }
            }
          )
          .subscribe({
            next: () => this.router.navigateByUrl('/tableau-de-bord'),
            error: (response) => alert(response.error.message),
          });
      } else {
        if (this.selectedFile) {
          this.form.value.img = this.selectedFile;
        }

        this.http.post('http://localhost:3000/foods', this.form.value, {
          headers: {
            'Authorization': 'Bearer ' + this.jwt.token
          }
        }).subscribe({
          next: () => this.router.navigateByUrl('/tableau-de-bord'),
          error: (response) => alert(response.error.message),
        });
      }
    }
  }
}
