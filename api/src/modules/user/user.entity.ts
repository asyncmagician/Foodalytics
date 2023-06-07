import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Food } from '../food/food.entity';
import { IsEmail, Matches } from 'class-validator';

@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @Column()
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, { message: 'Invalid password format' })
    password: string;    

    @OneToMany(() => Food, food => food.user, { nullable: true })
    foods: Food[];
    categories: any;
}

