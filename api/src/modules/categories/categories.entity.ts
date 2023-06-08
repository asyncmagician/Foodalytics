import { Entity, Column, PrimaryColumn, OneToMany } from "typeorm";
import { FoodCategories } from "../food-categories/entities/food-categories.entity";

export enum CategoryChoice {
    breakfast = "Petit déjeuner",
    meal = "Déjeuner",
    snack = "En cas",
    dinner = "Dîner",
}

@Entity()
export class Categories {
    @PrimaryColumn("uuid")
    id: string;

    @Column({
        type: "enum",
        enum: CategoryChoice,
        default: CategoryChoice.snack,
    })
    choice: CategoryChoice;

    @OneToMany(
        () => FoodCategories,
        (foodCategories) => foodCategories.categories,
        { nullable: true },
    )
    foodCategories: FoodCategories[];
}
