import {Component} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AuthentificationService} from "../../services/authentification.service";
import {Jwt} from "../../models/Jwt";
import {User} from "../../models/User";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user: any;
  jwt: Jwt | null = null;

  constructor(private http: HttpClient, private auth: AuthentificationService) {
    this.refresh();
    this.auth.$jwt.subscribe(jwt => this.jwt = jwt)
  }

  ngOnInit() {
    this.http.get<any>('http://localhost:3000/users').subscribe(
      response => {
        this.user = response;
      },
      error => {
        console.error('Une erreur s\'est produite lors de la récupération des informations utilisateur :', error);
      }
    );
  }
  
  refresh() {
    this.http
      .get<User[]>('http://localhost:3000/users')
      .subscribe((user) => (this.user = user));
  }
}
