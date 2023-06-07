import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
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

    @ManyToMany(() => Categories, { nullable: true })
    @JoinTable()
    categories: Categories[];

    @ManyToOne(() => User, user => user.foods, { nullable: true })
    user: User;

}

