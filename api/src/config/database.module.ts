import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
require("dotenv").config();

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "mysql",
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            autoLoadEntities: true,
            migrations: [],
            synchronize: true // TODO BEFORE PROD : false or delete
        })
    ]
})
export class DatabaseModule {}
