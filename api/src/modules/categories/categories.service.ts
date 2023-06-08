import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Categories } from "./categories.entity";
import { v4 as uuidv4 } from "uuid";
import { CategoriesInterface } from "./categories.interface";

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Categories)
        private readonly categoriesRepository: Repository<Categories>,
    ) {
    }

    async findAll(): Promise<Categories[]> {
        return this.categoriesRepository.find();
    }

    async findOne(id: string): Promise<Categories> {
        const categories = await this.categoriesRepository.findOne({ where: { id } });
        if (!categories) {
            throw new NotFoundException(`Categories with ID ${id} not found`);
        }
        return categories;
    }

    async create(categories: CategoriesInterface): Promise<Categories> {
        const newCategory = new Categories();
        Object.assign(newCategory, categories);
        newCategory.id = uuidv4();
        return this.categoriesRepository.save(newCategory);
    }

    async update(
        id: string,
        categories: Partial<Categories>,
    ): Promise<Categories> {
        const existingCategory = await this.categoriesRepository.findOne({
            where: { id },
        });
        if (!existingCategory) {
            throw new NotFoundException(`Categories with id ${id} not found`);
        }
        await this.categoriesRepository.update(id, categories);
        return this.categoriesRepository.findOne({ where: { id } });
    }

    async delete(id: string): Promise<void> {
        const deleteResult = await this.categoriesRepository.delete(id);
        if (deleteResult.affected === 0) {
            throw new NotFoundException(`Categories with ID ${id} not found`);
        }
    }

    async findCategoriesByFoodId(foodId: string) {
        return await this.categoriesRepository
            .createQueryBuilder("categories")
            .innerJoin("categories.foodCategories", "foodCategories")
            .where("foodCategories.food = :foodId", { foodId })
            .getMany();
    }
}
