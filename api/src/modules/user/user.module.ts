import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { User } from "./user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { JwtStrategy } from "../../strategies/jwt/jwt.strategy";
import { AuthService } from "../auth/auth.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule,
        JwtModule.register({
            secret: "mj4_+L4BxHpqSatv90.96(kN7", 
            signOptions: { expiresIn: "1h" }, 
        }),
    ],
    controllers: [UserController],
    providers: [UserService, JwtStrategy, AuthService],
})
export class UserModule {}
