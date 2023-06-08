import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "./user.entity";
import * as bcrypt from "bcrypt";
import { validateSync } from "class-validator";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user;
    }

    async create(user: Partial<User>): Promise<User> {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const newUser = {
            ...user,
            id: uuidv4(),
            password: hashedPassword,
        };

        const emailErrors = validateSync(newUser.email, {
            validationError: { target: false },
            groups: ["create"],
        });
        if (emailErrors.length > 0) {
            throw new Error("Invalid email");
        }

        const passwordErrors = validateSync(newUser.password, {
            validationError: { target: false },
            groups: ["create"],
        });
        if (passwordErrors.length > 0) {
            throw new Error("Invalid password");
        }

        return this.userRepository.save(newUser);
    }

    async update(id: string, user: Partial<User>): Promise<User> {
        if (user.password) {
            const hashedPassword = await bcrypt.hash(user.password, 10);
            user = {
                ...user,
                password: hashedPassword,
            };
        }

        const existingUser = await this.userRepository.findOne({
            where: { id },
        });
        if (!existingUser) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        const updatedUser = this.userRepository.create({
            ...existingUser,
            ...user,
        });

        const emailErrors = validateSync(updatedUser.email, {
            validationError: { target: false },
            groups: ["update"],
        });
        if (emailErrors.length > 0) {
            throw new Error("Invalid email");
        }

        const passwordErrors = validateSync(updatedUser.password, {
            validationError: { target: false },
            groups: ["update"],
        });
        if (passwordErrors.length > 0) {
            throw new Error("Invalid password");
        }

        await this.userRepository.update(id, user);
        return this.userRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await this.userRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}
