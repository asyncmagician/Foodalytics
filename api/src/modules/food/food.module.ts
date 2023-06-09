import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { Food } from "./food.entity";
import { FoodController } from "./food.controller";
import { FoodService } from "./food.service";
import { FoodCategoriesService } from "../food-categories/services/food-categories.service";
import { FoodCategories } from "../food-categories/entities/food-categories.entity";
import { CategoriesService } from "../categories/categories.service";
import { Categories } from "../categories/categories.entity";
import { UserService } from "../user/user.service";
import { JwtStrategy } from "src/strategies/jwt/jwt.strategy";
import { AuthService } from "../auth/auth.service";
import { User } from "../user/user.entity"; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Food, FoodCategories, Categories, User]), 
    JwtModule.register({
      secret: "mj4_+L4BxHpqSatv90.96(kN7",
    }),
  ],
  controllers: [FoodController],
  providers: [
    FoodService,
    FoodCategoriesService,
    CategoriesService,
    UserService,
    JwtStrategy,
    AuthService,
  ],
})
export class FoodModule {}
