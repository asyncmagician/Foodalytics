import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { FoodCategories } from "../entities/food-categories.entity";
import { Food } from "../../food/food.entity";
import { Categories } from "../../categories/categories.entity";
import { FoodService } from "../../food/food.service";
import { CategoriesService } from "../../categories/categories.service";

@Injectable()
export class FoodCategoriesService {
    constructor(
        @InjectRepository(FoodCategories)
        private readonly foodCategoriesRepository: Repository<FoodCategories>,
        private readonly foodService: FoodService,
        private readonly categoriesService: CategoriesService,
    ) {}

    async findAll(): Promise<FoodCategories[]> {
        return this.foodCategoriesRepository.find();
    }

    async findOne(id: string): Promise<FoodCategories> {
        const foodCategories = await this.foodCategoriesRepository.findOne({
            where: { id },
        });
        if (!foodCategories) {
            throw new NotFoundException(
                `Food categories with ID ${id} not found`,
            );
        }
        return foodCategories;
    }

    async create(
        foodId: string,
        categoriesId: string,
    ): Promise<FoodCategories> {
        const food = await this.foodService.findOne(foodId);
        const categories = await this.categoriesService.findOne(categoriesId);

        if (!food || !categories) {
            throw new BadRequestException(
                "At least one of the two records does not exist",
            );
        }

        const newFoodCategories = new FoodCategories();
        newFoodCategories.id = uuidv4();
        newFoodCategories.food = food;
        newFoodCategories.categories = categories;

        return this.foodCategoriesRepository.save(newFoodCategories);
    }

    async update(
        id: string,
        foodCategories: Partial<FoodCategories>,
    ): Promise<FoodCategories> {
        const existingFoodCategories =
            await this.foodCategoriesRepository.findOne({
                where: { id },
            });
        if (!existingFoodCategories) {
            throw new NotFoundException(
                `Food categories with id ${id} not found`,
            );
        }
        await this.foodCategoriesRepository.update(id, foodCategories);
        return this.foodCategoriesRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await this.foodCategoriesRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(
                `Food categories with ID ${id} not found`,
            );
        }
    }
}
