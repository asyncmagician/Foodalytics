import { ArrayMinSize, IsNumber, IsOptional, IsString } from "class-validator";

export class FoodInterface {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    name: string;

    @IsNumber()
    calories: number;

    @IsNumber()
    proteins: number;

    @IsNumber()
    lipids: number;

    @IsNumber()
    carbohydates: number;

    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsOptional()
    categories?: string[];
}
