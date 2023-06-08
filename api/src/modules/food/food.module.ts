import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Food } from "./food.entity";
import { FoodController } from "./food.controller";
import { FoodService } from "./food.service";
import { FoodCategoriesService } from "../food-categories/services/food-categories.service";
import { FoodCategories } from "../food-categories/entities/food-categories.entity";
import { CategoriesService } from "../categories/categories.service";
import { Categories } from "../categories/categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Food, FoodCategories, Categories])],
    controllers: [FoodController],
    providers: [FoodService, FoodCategoriesService, CategoriesService],
})
export class FoodModule {}
