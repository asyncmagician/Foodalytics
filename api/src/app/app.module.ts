import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DatabaseModule } from "src/config/database.module";
import { UserModule } from "src/modules/user/user.module";
import { FoodModule } from "src/modules/food/food.module";
import { CategoriesModule } from "src/modules/categories/categories.module";
import { FoodCategoriesModule } from "../modules/food-categories/food-categories.module";

@Module({
    imports: [
        DatabaseModule,
        UserModule,
        FoodModule,
        CategoriesModule,
        FoodCategoriesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
