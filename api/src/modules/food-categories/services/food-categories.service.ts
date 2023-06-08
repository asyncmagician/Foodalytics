import { BadRequestException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
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
    ) {}

    async findAll(
        idFood?: string,
        idCategories?: string,
    ): Promise<FoodCategories[]> {
        return this.foodCategoriesRepository.find({
            where: {
                food: {
                    id: idFood,
                },
                categories: {
                    id: idCategories,
                },
            },
        });
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

        const foodCategoriesExist = await this.foodCategoriesRepository.exist({
            where: {
                food: food,
                categories: categories,
            },
        });

        if (!foodCategoriesExist) {
            const newFoodCategories = new FoodCategories();
            newFoodCategories.id = uuidv4();
            newFoodCategories.food = food;
            newFoodCategories.categories = categories;

            return this.foodCategoriesRepository.save(newFoodCategories);
        }
    }

    async delete(foodId: string, categoriesId: string): Promise<void> {
        const deleteResult = await this.foodCategoriesRepository.delete({
            food: {
                id: foodId,
            },
            categories: {
                id: categoriesId,
            },
        });
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Food categories not found`);
        }
    }

    async deleteById(id: string) {
        return this.foodCategoriesRepository.delete(id);
    }
}
