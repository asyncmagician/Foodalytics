import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from './user.entity';

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService
            .findAll()
            .then((users: User[]) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "Users retrieved successfully"
                    },
                    body: {
                        data: users
                    }
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error retrieving users"
                    },
                    body: {
                        error: error.message
                    }
                };
            });
    }

    @Get(":id")
    findOne(@Param("id") id: number) {
        return this.userService
            .findOne(id)
            .then((user: User) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "User retrieved successfully"
                    },
                    body: {
                        data: user
                    }
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error retrieving user"
                    },
                    body: {
                        error: error.message
                    }
                };
            });
    }

    @Post()
    create(@Body() user: Partial<User>) {
        return this.userService
            .create(user)
            .then((createdUser: User) => {
                return {
                    header: {
                        statusCode: HttpStatus.CREATED,
                        message: "User created successfully"
                    },
                    body: {
                        data: createdUser
                    }
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error creating user"
                    },
                    body: {
                        error: error.message
                    }
                };
            });
    }

    @Put(":id")
    update(@Param("id") id: number, @Body() user: Partial<User>) {
        return this.userService
            .update(id, user)
            .then((updatedUser: User) => {
                return {
                    header: {
                        statusCode: HttpStatus.OK,
                        message: "User updated successfully"
                    },
                    body: {
                        data: updatedUser
                    }
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error updating user"
                    },
                    body: {
                        error: error.message
                    }
                };
            });
    }

    @Delete(":id")
    delete(@Param("id") id: number) {
        return this.userService
            .delete(id)
            .then(() => {
                return {
                    header: {
                        statusCode: HttpStatus.NO_CONTENT,
                        message: "User deleted successfully"
                    }
                };
            })
            .catch((error) => {
                return {
                    header: {
                        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                        message: "Error deleting user"
                    },
                    body: {
                        error: error.message
                    }
                };
            });
    }
}
