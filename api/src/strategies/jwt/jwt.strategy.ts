import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { UserService } from "../../modules/user/user.service";
import { User } from "../../modules/user/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: "mj4_+L4BxHpqSatv90.96(kN7",
        });
    }

    async validate(payload: any): Promise<User> {
        const { id } = payload;
        const user = await this.userService.findOne(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
