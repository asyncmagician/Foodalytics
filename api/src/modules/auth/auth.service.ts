import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/user.entity";

@Injectable()
export class AuthService {
  private readonly revokedTokens: string[] = [];

  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }

    return null;
  }


  async validateToken(token: string): Promise<boolean> {
    const decodedToken = await this.jwtService.verifyAsync(token);
    if (!decodedToken) {
      return false; 
    }

    const expirationDate = decodedToken.exp;
    if (expirationDate) {
      const isRevoked = this.isTokenRevoked(token, expirationDate);
      if (isRevoked) {
        return false; 
      }
    }

    return true; 
  }

  private isTokenRevoked(token: string, expirationDate: number): boolean {
    const currentDate = Math.floor(Date.now() / 1000);
    return currentDate > expirationDate || this.revokedTokens.includes(token);
  }

  async revokeToken(token: string): Promise<void> {
    this.revokedTokens.push(token);
  }
  
  generateToken(user: User): string {
    const payload = { id: user.id };
    const expiresIn = '1h';
    return this.jwtService.sign(payload, { expiresIn });
  }
}
