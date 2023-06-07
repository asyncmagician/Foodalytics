import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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

    @ManyToMany(() => Food)
    @JoinTable()
    food: Food[]

    @ManyToOne(() => User, user => user.categories)
    user: User;

}

function ManyToMany(arg0: () => typeof Food): (target: Categories, propertyKey: "food") => void {
    throw new Error('Function not implemented.');
}


function JoinTable(): (target: Categories, propertyKey: "food") => void {
    throw new Error('Function not implemented.');
}
function ManyToOne(arg0: () => any, arg1: (user: any) => any): (target: Categories, propertyKey: "user") => void {
    throw new Error('Function not implemented.');
}

