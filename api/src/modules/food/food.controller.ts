import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpStatus, BadRequestException,
} from "@nestjs/common";
import { Food } from "./food.entity";
import { FoodService } from "./food.service";
import { FoodCategoriesService } from "../food-categories/services/food-categories.service";
import { FoodInterface } from "./food.interface";
import { Categories } from "../categories/categories.entity";
import { CategoriesService } from "../categories/categories.service";

@Controller("foods")
export class FoodController {
    constructor(
        private readonly foodService: FoodService,
        private readonly foodCategoriesService: FoodCategoriesService,
        private readonly categoriesService: CategoriesService,
    ) {}

    @Get()
    findAll() {
        return this.foodService
            .findAll()
            .then((foods: Food[]) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Foods retrieved successfully",
                    },
                    body: {
                        data: foods,
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error retrieving foods",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.foodService
            .findOne(id)
            .then((food: Food) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Food retrieved successfully",
                    },
                    body: {
                        data: food,
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error retrieving food",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @Post()
    async create(@Body() food: FoodInterface) {
        return this.foodService
            .create(food)
            .then(async (createdFood: Food) => {
                if (food.categories) {
                    for (const categoriesId of food.categories) {
                        await this.foodCategoriesService.create(
                            createdFood.id,
                            categoriesId,
                        );
                    }
                }

                return {
                    header: {
                        statusCode: HttpStatus.CREATED,
                        message: "Food created successfully",
                    },
                    body: {
                        data: createdFood,
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error creating food",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @Put(":id")
    update(@Param("id") id: string, @Body() food: Partial<FoodInterface>) {
        return this.foodService
            .update(id, food)
            .then((updatedFood: Food) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Food updated successfully",
                    },
                    body: {
                        data: updatedFood,
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error updating food",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.foodService
            .delete(id)
            .then(() => {
                return {
                    header: {
                        statusCode: HttpStatus.NO_CONTENT,
                        message: "Food deleted successfully",
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error deleting food",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @Get(":id/categories")
    async findCategories(@Param("id") foodId: string) {
        await this.foodService.findOne(foodId);
        return this.categoriesService
            .findCategoriesByFoodId(foodId)
            .then((categories: Categories[]) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Food categories retrieved successfully",
                    },
                    body: {
                        data: categories,
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error retrieving food categories",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @Post(":id/categories")
    async addCategoriesToFood(@Param("id") foodId: string, @Body() body) {
        if (
            body &&
            body.categories &&
            body.categories.constructor === Array<string>
        ) {
            for (const categoryId of body.categories) {
                await this.foodCategoriesService.create(foodId, categoryId);
            }

            const data = await this.findCategories(foodId);

            return {
                header: {
                    statusCode: HttpStatus.OK,
                    message: `Categories linked successfully to food with ID ${foodId}`,
                },
                body: data.body,
            };
        }

        throw new BadRequestException(
            'The body of the request must consist of a "categories" array containing categories identifiers',
        );
    }

    @Delete(":id/categories/delete-one")
    deleteOneFoodCategories(@Param("id") foodId: string, @Body() body) {
        if (
            body &&
            body.categoriesId &&
            body.categoriesId.constructor === String
        ) {
            return this.foodCategoriesService.delete(foodId, body.categoriesId);
        }

        throw new BadRequestException(
            'The body of the request must consist of a "categoriesId" string containing the category identifier to delete',
        );
    }

    @Delete(":id/categories/delete-all")
    deleteAllFoodsToCategory(@Param("id") foodId: string) {
        this.foodCategoriesService
            .findAll(foodId)
            .then(async (foodCategories) => {
                for (const foodCategory of foodCategories) {
                    await this.foodCategoriesService.deleteById(
                        foodCategory.id,
                    );
                }
            });
    }
}
