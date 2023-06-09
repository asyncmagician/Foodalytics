import { Component } from '@angular/core';
import {AuthentificationService} from "./services/authentification.service";
import { ActivatedRoute } from "@angular/router";
import { Message } from "./models/Message";
import { Jwt } from "./models/Jwt";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  jwt: Jwt | null = null;
  message: Message | null = null;

  constructor(
    private auth: AuthentificationService,
    private route: ActivatedRoute
  ){
    this.auth.$jwt.subscribe((jwt) => this.jwt = jwt);
    this.route.queryParams.subscribe((params) => {
      if (params['errorMessage'] || params['successMessage'] || params['infoMessage']) {
        this.message = {
          error: params['errorMessage'],
          success: params['successMessage'],
          info: params['infoMessage']
        };
      }
    });
  }

  onLogout() {
    this.auth.logout();
  }
}
