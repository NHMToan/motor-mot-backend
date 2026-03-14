import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from "@nestjs/common";
import { Prisma, ProductCategory } from "@prisma/client";
import { PrismaService } from "../../common/prisma/prisma.service";
import {
  mapCategorySlugToEnum,
  serializeCategory
} from "../../common/utils/category-meta";
import { slugify } from "../../common/utils/slugify";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findAll(query: QueryProductsDto) {
    const category = mapCategorySlugToEnum(query.category);

    const where: Prisma.ProductWhereInput = {
      ...(query.category ? { category } : {}),
      ...(query.search
        ? {
            OR: [
              { name: { contains: query.search, mode: "insensitive" } },
              { summary: { contains: query.search, mode: "insensitive" } },
              { sku: { contains: query.search, mode: "insensitive" } }
            ]
          }
        : {})
    };

    const products = await this.prisma.product.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }]
    });

    return products.map((product) => this.serializeProduct(product));
  }

  async findOne(idOrSlug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }]
      }
    });

    if (!product) {
      throw new NotFoundException("Không tìm thấy sản phẩm.");
    }

    return this.serializeProduct(product);
  }

  async create(createProductDto: CreateProductDto) {
    await this.ensureUniqueSku(createProductDto.sku);

    const slug = await this.ensureUniqueSlug(slugify(createProductDto.name));
    const product = await this.prisma.product.create({
      data: {
        ...createProductDto,
        slug,
        descriptionBlocks:
          (createProductDto.descriptionBlocks ?? []) as Prisma.InputJsonValue,
        galleryImages: (createProductDto.galleryImages ?? []) as Prisma.InputJsonValue,
        price: new Prisma.Decimal(createProductDto.price)
      }
    });

    return this.serializeProduct(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new NotFoundException("Không tìm thấy sản phẩm để cập nhật.");
    }

    if (updateProductDto.sku && updateProductDto.sku !== existingProduct.sku) {
      await this.ensureUniqueSku(updateProductDto.sku, id);
    }

    const slug =
      updateProductDto.name && updateProductDto.name !== existingProduct.name
        ? await this.ensureUniqueSlug(slugify(updateProductDto.name), id)
        : existingProduct.slug;

    const {
      descriptionBlocks,
      galleryImages,
      price,
      ...restUpdateData
    } = updateProductDto;

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        ...restUpdateData,
        slug,
        ...(descriptionBlocks
          ? {
              descriptionBlocks: descriptionBlocks as Prisma.InputJsonValue
            }
          : {}),
        ...(galleryImages
          ? {
              galleryImages: galleryImages as Prisma.InputJsonValue
            }
          : {}),
        ...(typeof price === "number"
          ? { price: new Prisma.Decimal(price) }
          : {})
      }
    });

    return this.serializeProduct(product);
  }

  async remove(id: string) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id }
    });

    if (!existingProduct) {
      throw new NotFoundException("Không tìm thấy sản phẩm để xóa.");
    }

    await this.prisma.product.delete({
      where: { id }
    });

    return {
      success: true
    };
  }

  private async ensureUniqueSku(sku: string, ignoreId?: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku }
    });

    if (product && product.id !== ignoreId) {
      throw new BadRequestException("SKU đã tồn tại.");
    }
  }

  private async ensureUniqueSlug(baseSlug: string, ignoreId?: string) {
    if (!baseSlug) {
      throw new BadRequestException("Tên sản phẩm chưa hợp lệ để tạo slug.");
    }

    let slug = baseSlug;
    let counter = 1;

    while (true) {
      const product = await this.prisma.product.findUnique({
        where: { slug }
      });

      if (!product || product.id === ignoreId) {
        return slug;
      }

      counter += 1;
      slug = `${baseSlug}-${counter}`;
    }
  }

  private serializeProduct(product: {
    id: string;
    name: string;
    slug: string;
    category: ProductCategory;
    sku: string;
    summary: string;
    description: string;
    price: Prisma.Decimal;
    imageUrl: string | null;
    descriptionBlocks: Prisma.JsonValue | null;
    galleryImages: Prisma.JsonValue | null;
    featured: boolean;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...product,
      price: Number(product.price),
      descriptionBlocks: Array.isArray(product.descriptionBlocks)
        ? product.descriptionBlocks
        : [],
      galleryImages: Array.isArray(product.galleryImages)
        ? product.galleryImages
        : [],
      category: serializeCategory(product.category)
    };
  }
}
