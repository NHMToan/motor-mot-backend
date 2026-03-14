import { ProductCategory } from "@prisma/client";
import { Transform } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  sku: string;

  @IsEnum(ProductCategory)
  category: ProductCategory;

  @IsString()
  summary: string;

  @IsString()
  description: string;

  @IsOptional()
  @Transform(({ value }) => value)
  @IsArray()
  descriptionBlocks?: unknown[];

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @Transform(({ value }) => value)
  @IsArray()
  galleryImages?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
