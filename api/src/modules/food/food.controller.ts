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
import { Food } from "./food.entity";
import { FoodService } from "./food.service";

@Controller("foods")
export class FoodController {
    constructor(private readonly foodService: FoodService) {}

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
    create(@Body() food: Partial<Food>) {
        return this.foodService
            .create(food)
            .then((createdFood: Food) => {
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
    update(@Param("id") id: string, @Body() food: Partial<Food>) {
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
}
