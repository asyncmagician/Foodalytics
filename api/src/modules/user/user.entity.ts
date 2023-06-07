import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Food } from '../food/food.entity';

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(() => Food, food => food.user)
    foods: Food[];
}

function OneToMany(arg0: () => any, arg1: (food: any) => any): (target: User, propertyKey: "foods") => void {
    throw new Error('Function not implemented.');
}

