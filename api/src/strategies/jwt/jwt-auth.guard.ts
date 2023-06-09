import { Injectable, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";
import { AuthService } from "../../modules/auth/auth.service";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  constructor(private readonly authService: AuthService) {
    super();
  }

  canActivate(context: ExecutionContext): Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromRequest(request);

    return from(this.authService.validateToken(token)).pipe(
      map((isTokenValid: boolean) => {
        if (!isTokenValid) {
          throw new UnauthorizedException();
        }
        return true;
      })
    );
  }

  private extractTokenFromRequest(request: any): string {
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7);
    }
    return null;
  }
}