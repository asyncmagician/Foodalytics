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

@Controller("categories")
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

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
    create(@Body() categories: Partial<Categories>) {
        return this.categoriesService
            .create(categories)
            .then((createdCategory: Categories) => {
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
    update(@Param("id") id: string, @Body() categories: Partial<Categories>) {
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
}
