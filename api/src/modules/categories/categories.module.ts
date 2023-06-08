import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "./categories.entity";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./categories.service";
import { FoodService } from "../food/food.service";
import { Food } from "../food/food.entity";
import { FoodCategoriesService } from "../food-categories/services/food-categories.service";
import { FoodCategories } from "../food-categories/entities/food-categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Categories, Food, FoodCategories])],
    controllers: [CategoriesController],
    providers: [CategoriesService, FoodService, FoodCategoriesService],
})
export class CategoriesModule {}
