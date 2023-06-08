import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Param,
    Body,
    HttpStatus,
} from "@nestjs/common";
import { Categories } from "./categories.entity";
import { CategoriesService } from "./categories.service";
import { FoodService } from "../food/food.service";
import { Food } from "../food/food.entity";
import { CategoriesInterface } from "./categories.interface";
import { FoodCategoriesService } from "../food-categories/services/food-categories.service";

@Controller("categories")
export class CategoriesController {
    constructor(
        private readonly categoriesService: CategoriesService,
        private readonly foodService: FoodService,
        private readonly foodCategoriesService: FoodCategoriesService
    ) {}

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

    @Put(":id")
    update(
        @Param("id") id: string,
        @Body() categories: Partial<CategoriesInterface>,
    ) {
        return this.categoriesService
            .update(id, categories)
            .then(async (updatedCategory: Categories) => {
                if (categories.foods) {
                    await this.foodCategoriesService.updateCategoriesFoods(
                        id,
                        categories.foods,
                    );
                }

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
}
