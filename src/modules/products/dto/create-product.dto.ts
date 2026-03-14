import { ProductCategory } from "@prisma/client";
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
  @IsArray()
  descriptionBlocks?: Array<Record<string, unknown>>;

  @IsNumber()
  @Min(0)
  price: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsArray()
  galleryImages?: string[];

  @IsOptional()
  @IsBoolean()
  featured?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
