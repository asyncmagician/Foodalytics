import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthentificationService} from "../../services/authentification.service";
import {Jwt} from "../../models/Jwt";
import {Food} from "../../models/Food";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  foodList: Food[] = [];
  jwt: Jwt | null = null;

  constructor(private http: HttpClient, private auth: AuthentificationService) {
    this.refresh();
    this.auth.$jwt.subscribe(jwt => this.jwt = jwt)
  }

  refresh() {
    if (this.jwt) {
      this.http
        .get<any>('http://localhost:3000/foods', {
          headers: {
            'Authorization': 'Bearer ' + this.jwt.token
          }
        })
        .subscribe({
          next: (response) => this.foodList = response.body.data
        });
    }
  }

  onFoodDelete(foodId: string) {
    if (this.jwt) {
      this.http.delete('http://localhost:3000/article/' + foodId, {
        headers: {
          'Authorization': 'Bearer ' + this.jwt.token
        }
      }).subscribe({
        next: () => this.refresh(),
        error: (response) => console.log(response),
      });
    }
  }
}
