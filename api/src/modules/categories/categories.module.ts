import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Categories } from "./categories.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Categories])],
    // controllers: [UserController],
    // providers: [UserService]
})
export class CategoriesModule {}

