import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpStatus, BadRequestException, UseGuards,
} from "@nestjs/common";
import { Categories } from "./categories.entity";
import { CategoriesService } from "./categories.service";
import { FoodService } from "../food/food.service";
import { Food } from "../food/food.entity";
import { CategoriesInterface } from "./categories.interface";
import { FoodCategoriesService } from "../food-categories/services/food-categories.service";
import { JwtAuthGuard } from "src/strategies/jwt/jwt-auth.guard";

@Controller("categories")
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly foodService: FoodService,
        private readonly foodCategoriesService: FoodCategoriesService,
    ) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll() {
        return this.categoriesService
            .findAll()
            .then((categories: Categories[]) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Categories retrieved successfully",
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
                        message: "Error retrieving categories",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    findOne(@Param("id") id: string) {
        return this.categoriesService
            .findOne(id)
            .then((categories: Categories) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Categories retrieved successfully",
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
                        message: "Error retrieving categories",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    create(@Body() categories: CategoriesInterface) {
        return this.categoriesService
            .create(categories)
            .then(async (createdCategory: Categories) => {
                if (categories.foods) {
                    for (const foodId of categories.foods) {
                        await this.foodCategoriesService.create(
                            foodId,
                            createdCategory.id,
                        );
                    }
                }

                return {
                    header: {
                        statusCode: HttpStatus.CREATED,
                        message: "Categories created successfully",
                    },
                    body: {
                        data: createdCategory,
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error creating categories",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    update(
        @Param("id") id: string,
        @Body() categories: Partial<CategoriesInterface>,
    ) {
        return this.categoriesService
            .update(id, categories)
            .then((updatedCategory: Categories) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Categories updated successfully",
                    },
                    body: {
                        data: updatedCategory,
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error updating categories",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.categoriesService
            .delete(id)
            .then(() => {
                return {
                    header: {
                        statusCode: HttpStatus.NO_CONTENT,
                        message: "Categories deleted successfully",
                    },
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error deleting categories",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @UseGuards(JwtAuthGuard)
    @Get(":id/foods")
    async findFoods(@Param("id") categoriesId: string) {
        await this.categoriesService.findOne(categoriesId);
        return this.foodService
            .findFoodsByCategoriesId(categoriesId)
            .then((foods: Food[]) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Category foods retrieved successfully",
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
                        message: "Error retrieving category foods",
                    },
                    body: {
                        error: error.message,
                    },
                };
            });
    }

    @UseGuards(JwtAuthGuard)
    @Post(":id/foods")
    async addFoodsToCategory(@Param("id") categoriesId: string, @Body() body) {
        if (body && body.foods && body.foods.constructor === Array<string>) {
            for (const foodId of body.foods) {
                await this.foodCategoriesService.create(foodId, categoriesId);
            }

            const data = await this.findFoods(categoriesId);

            return {
                header: {
                    statusCode: HttpStatus.OK,
                    message: `Foods linked successfully to category with ID ${categoriesId}`,
                },
                body: data.body,
            };
        }

        throw new BadRequestException(
            'The body of the request must consist of a "foods" array containing food identifiers',
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id/foods/delete-one")
    deleteOneFoodCategories(@Param("id") categoriesId: string, @Body() body) {
        if (body && body.foodId && body.foodId.constructor === String) {
            return this.foodCategoriesService.delete(body.foodId, categoriesId);
        }

        throw new BadRequestException(
            'The body of the request must consist of a "foodId" string containing the food identifier to delete',
        );
    }

    @UseGuards(JwtAuthGuard)
    @Delete(":id/foods/delete-all")
    deleteAllFoodsToCategory(@Param("id") categoriesId: string) {
        this.foodCategoriesService
            .findAll(undefined, categoriesId)
            .then(async (foodCategories) => {
                for (const foodCategory of foodCategories) {
                    await this.foodCategoriesService.deleteById(
                        foodCategory.id,
                    );
                }
            });
    }
}
