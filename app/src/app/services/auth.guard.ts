import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AuthentificationService } from './authentification.service';

export const authGuard = () => {
  const router = inject(Router);
  const auth = inject(AuthentificationService);

  return auth.$jwt.pipe(
    tap((jwt) => (jwt == null ? router.navigate(['/connexion']) : true))
  );
};
