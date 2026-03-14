import { Injectable } from "@nestjs/common";
import { ProductCategory } from "@prisma/client";
import { serializeCategory } from "../../common/utils/category-meta";

@Injectable()
export class CategoriesService {
  findAll() {
    return Object.values(ProductCategory).map((category) =>
      serializeCategory(category)
    );
  }
}
