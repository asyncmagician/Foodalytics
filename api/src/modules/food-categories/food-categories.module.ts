import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodCategories } from "./entities/food-categories.entity";
import { FoodCategoriesService } from "./services/food-categories.service";
import { FoodService } from "../food/food.service";
import { CategoriesService } from "../categories/categories.service";
import { Food } from "../food/food.entity";
import { Categories } from "../categories/categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FoodCategories, Food, Categories])],
    controllers: [],
    providers: [FoodCategoriesService, FoodService, CategoriesService],
})
export class FoodCategoriesModule {}
