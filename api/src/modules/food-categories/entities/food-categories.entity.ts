import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Food } from "../../food/food.entity";
import { Categories } from "../../categories/categories.entity";

@Entity("food_categories")
export class FoodCategories {
    @PrimaryColumn("uuid")
    id: string;

    @ManyToOne(() => Food, (food) => food.foodCategories)
    food: Food;

    @ManyToOne(() => Categories, (categories) => categories.foodCategories)
    categories: Categories;
}
