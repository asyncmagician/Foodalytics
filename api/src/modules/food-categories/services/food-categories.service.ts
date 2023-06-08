import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { FoodCategories } from "../entities/food-categories.entity";
import { FoodService } from "../../food/food.service";
import { CategoriesService } from "../../categories/categories.service";

@Injectable()
export class FoodCategoriesService {
    constructor(
        @InjectRepository(FoodCategories)
        private readonly foodCategoriesRepository: Repository<FoodCategories>,
        private readonly foodService: FoodService,
        private readonly categoriesService: CategoriesService,
    ) {
    }

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

    async updateCategoriesFoods(
        categoriesId: string,
        newFoods: Array<string>,
    ): Promise<FoodCategories[]> {
        for (const foodId of newFoods) {
            const foodExist = await this.foodCategoriesRepository.exist({
                where: {
                    food: {
                        id: foodId,
                    },
                    categories: {
                        id: categoriesId,
                    },
                },
            });
            if (foodExist) {
                continue;
            }

            const newFoodCategories = new FoodCategories();
            newFoodCategories.food = await this.foodService.findOne(foodId);
            newFoodCategories.categories = await this.categoriesService.findOne(
                categoriesId,
            );
            await this.foodCategoriesRepository.insert(newFoodCategories);
        }

        return await this.foodCategoriesRepository.find({
            where: {
                categories: {
                    id: categoriesId,
                },
            },
        });
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
