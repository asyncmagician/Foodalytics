import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
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

    @OneToMany(() => Food, food => food.user, { nullable: true })
    foods: Food[];
    categories: any;
}

