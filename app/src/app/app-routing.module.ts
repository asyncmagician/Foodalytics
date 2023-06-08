import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from "./views/home/home.component";
import {Page404Component} from "./views/page404/page404.component";
import {LoginComponent} from "./views/login/login.component";

const routes: Routes = [
  { path: 'accueil', component: HomeComponent },
  { path: 'connexion', component: LoginComponent },
  { path: '', redirectTo: 'accueil', pathMatch: 'full' },
  { path: '**', component: Page404Component },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
