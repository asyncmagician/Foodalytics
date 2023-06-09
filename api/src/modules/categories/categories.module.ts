import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "./categories.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { FoodService } from "../food/food.service";
import { Food } from "../food/food.entity";
import { FoodCategoriesService } from "../food-categories/services/food-categories.service";
import { FoodCategories } from "../food-categories/entities/food-categories.entity";
import { User } from "../user/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "../user/user.service";
import { JwtStrategy } from "src/strategies/jwt/jwt.strategy";
import { AuthService } from "../auth/auth.service";

@Module({
    imports: [TypeOrmModule.forFeature([Categories, Food, FoodCategories, User]),
    JwtModule.register({
        secret: "mj4_+L4BxHpqSatv90.96(kN7",
      }),
    ],
    controllers: [CategoriesController],
    providers: [
        CategoriesService, 
        FoodService, 
        FoodCategoriesService,
        UserService,
        JwtStrategy,
        AuthService
    ],
})
export class CategoriesModule {}
