import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Food } from "./food.entity";
import { v4 as uuidv4 } from "uuid";
import { FoodInterface } from "./food.interface";
import { Categories } from "../categories/categories.entity";

@Injectable()
export class FoodService {
    constructor(
        @InjectRepository(Food)
        private readonly foodRepository: Repository<Food>,
    ) {}

    async findAll(): Promise<Food[]> {
        return this.foodRepository.find();
    }

    async findOne(id: string): Promise<Food> {
        const food = await this.foodRepository.findOne({ where: { id } });
        if (!food) {
            throw new NotFoundException(`Food with ID ${id} not found`);
        }
        return food;
    }

    async create(food: FoodInterface): Promise<Food> {
        const newFood = {
            id: uuidv4(),
            ...food,
        };

        return this.foodRepository.save(newFood);
    }

    async update(id: string, food: Partial<Food>): Promise<Food> {
        const existingFood = await this.foodRepository.findOne({
            where: { id },
        });
        if (!existingFood) {
            throw new NotFoundException(`Food with id ${id} not found`);
        }
        await this.foodRepository.update(id, food);
        return this.foodRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await this.foodRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Food with ID ${id} not found`);
        }
    }

    async findFoodsByCategoriesId(categoriesId: string) {
        return await this.foodRepository
            .createQueryBuilder("foods")
            .innerJoin("foods.foodCategories", "foodCategories")
            .where("foodCategories.categories = :categoriesId", {
                categoriesId,
            })
            .getMany();
    }
}
