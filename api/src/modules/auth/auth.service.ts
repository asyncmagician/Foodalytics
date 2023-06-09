import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { User } from "../user/user.entity";

@Injectable()
export class AuthService {
    private readonly revokedTokens = new Set<string>(); // Liste noire de tokens révoqués

    constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

    async validateUser(email: string, password: string): Promise<User> {
        const user = await this.userService.findByEmail(email);
    
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
    
        return null;
    }

    async revokeToken(token: string): Promise<void> {
        this.revokedTokens.add(token);
    }

    generateToken(user: User): string {
        const payload = { id: user.id };
        return this.jwtService.sign(payload);
    }
}
