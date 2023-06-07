import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, ManyToOne } from 'typeorm';
import { Food } from '../food/food.entity';
import { User } from '../user/user.entity';

export enum CategoryChoice {
  breakfast = 'Petit déjeuner',
  meal = 'Déjeuner',
  snack = 'En cas',
  dinner = 'Dîner',
}
@Entity()

export class Categories {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'enum',
        enum: CategoryChoice,
        default: CategoryChoice.snack,
      })
      choice: CategoryChoice;

    @ManyToMany(() => Food, { nullable: true })
    @JoinTable()
    food: Food[]

}

