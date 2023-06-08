import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FoodCategories } from "./entities/food-categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([FoodCategories])],
    controllers: [],
    providers: [],
})
export class FoodCategoriesModule {}
