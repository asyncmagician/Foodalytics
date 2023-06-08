import { ArrayMinSize, IsOptional, IsString } from "class-validator";

export class CategoriesInterface {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    choice: string;

    @ArrayMinSize(1)
    @IsString({ each: true })
    @IsOptional()
    foods?: string[];
}
