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
    this.http
      .get<Food[]>('http://localhost:3000/foods')
      .subscribe((foodList) => (this.foodList = foodList));
  }

  onFoodDelete(foodId: string) {
    this.http.delete('http://localhost:3000/article/' + foodId).subscribe({
      next: () => this.refresh(),
      error: (response) => console.log(response),
    });
  }
}
