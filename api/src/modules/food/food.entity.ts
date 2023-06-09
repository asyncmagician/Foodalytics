import {
    Entity,
    Column,
    ManyToOne,
    PrimaryColumn,
    OneToMany,
} from "typeorm";
import { User } from "../user/user.entity";
import { FoodCategories } from "../food-categories/entities/food-categories.entity";

@Entity()
export class Food {
    @PrimaryColumn("uuid")
    id: string;

    @Column()
    name: string;

    @Column()
    calories: number;

    @Column()
    proteins: number;

    @Column()
    lipids: number;

    @Column()
    carbohydates: number;

    @Column()
    img: string;

    @OneToMany(() => FoodCategories, (foodCategories) => foodCategories.food, { nullable: true })
    foodCategories: FoodCategories[];

    @ManyToOne(() => User, (user) => user.foods, { nullable: true })
    user: User;
}
