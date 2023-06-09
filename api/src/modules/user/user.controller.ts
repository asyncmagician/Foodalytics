import { Controller, Get, Post, Put, Delete, Param, Body, HttpStatus, HttpCode, UseGuards, UnauthorizedException, NotFoundException, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from './user.entity';
import { JwtAuthGuard } from "../../strategies/jwt/jwt-auth.guard";
import { AuthService } from "../auth/auth.service";
import * as bcrypt from 'bcrypt';
import { Request } from "express";

@Controller("users")
export class UserController {
    userRepository: any;
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @Post("login")
    async login(@Body() credentials: { email: string; password: string }) {
        const user = await this.userService.findByEmail(credentials.email);

        if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const token = this.authService.generateToken(user);
        const isAdmin = user.isAdmin;

        return {
            header: {
                statusCode: HttpStatus.OK,
                message: "Login successful",
            },
            body: {
                token,
                isAdmin,
                userId: user.id
            },
        };
    }

    @Post('logout')
    async logout(@Req() request: Request) {
      const authorizationHeader = request.headers['authorization'];
      const token = authorizationHeader.split('Bearer ')[1];
  
      await this.authService.revokeToken(token);
  
      return {
        header: {
          statusCode: HttpStatus.OK,
          message: 'Logout successful',
        },
      };  
    }
    

    @UseGuards(JwtAuthGuard)
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

    @UseGuards(JwtAuthGuard)
    @Get(":id")
    findOne(@Param("id") id: string) {
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

    @UseGuards(JwtAuthGuard)
    @Put(":id")
    update(@Param("id") id: string, @Body() user: Partial<User>) {
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

    @UseGuards(JwtAuthGuard)
    @Delete(":id")
    delete(@Param("id") id: string) {
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
