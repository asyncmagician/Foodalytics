import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Categories } from '../categories/categories.entity';
import { User } from '../user/user.entity';

@Entity()

export class Food {
    @PrimaryGeneratedColumn()
    id: number;

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

    @ManyToMany(() => Categories)
    @JoinTable()
    categories: Categories[];

    @ManyToOne(() => User, user => user.foods)
    user: User;

}


function ManyToMany(arg0: () => typeof Categories): (target: Food, propertyKey: "categories") => void {
    throw new Error('Function not implemented.');
}


function JoinTable(): (target: Food, propertyKey: "categories") => void {
    throw new Error('Function not implemented.');
}
function ManyToOne(arg0: () => typeof User, arg1: (user: any) => any): (target: Food, propertyKey: "user") => void {
    throw new Error('Function not implemented.');
}

