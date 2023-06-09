import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthentificationService } from '../../services/authentification.service';
import { Jwt } from '../../models/Jwt';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  user: any;
  jwt: Jwt | null = null;
  imageUrls: string[] = [
    'https://images4.alphacoders.com/786/786697.jpg',
    'https://images7.alphacoders.com/110/1103153.jpg',
    'https://images2.alphacoders.com/130/130202.jpg',
    'https://images3.alphacoders.com/227/227305.jpg',
    'https://images2.alphacoders.com/276/276650.jpg',
    'https://images4.alphacoders.com/263/263186.jpg',
    'https://images4.alphacoders.com/215/21574.jpg',
    'https://images4.alphacoders.com/276/276924.jpg',
    'https://images7.alphacoders.com/304/304627.jpg',
  ];

  constructor(
    private http: HttpClient,
    private auth: AuthentificationService,
    private sanitizer: DomSanitizer
  ) {
    this.auth.$jwt.subscribe((jwt) => (this.jwt = jwt));
    this.refresh();
  }

  getRandomImageUrl(): SafeResourceUrl {
    const randomIndex = Math.floor(Math.random() * this.imageUrls.length);
    const randomUrl = this.imageUrls[randomIndex];
    return this.sanitizer.bypassSecurityTrustResourceUrl(randomUrl);
  }

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    if (this.jwt) {
      this.http
        .get<any>('http://localhost:3000/users/' + this.jwt.userId, {
          headers: {
            'Authorization': 'Bearer ' + this.jwt.token
          }
        })
        .subscribe(
          (response) => {
            this.user = response.body.data;
          },
          (error) => {
            console.error(
              'Une erreur s\'est produite lors de la récupération des informations utilisateur :',
              error.message
            );
          }
        );
    }
  }
}
