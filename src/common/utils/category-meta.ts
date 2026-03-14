import { ProductCategory } from "@prisma/client";

export const categoryMeta = {
  [ProductCategory.MOTOR_GIAM_TOC]: {
    label: "Motor giảm tốc",
    slug: "motor-giam-toc",
    description: "Động cơ liền hộp số cho hệ truyền động công nghiệp."
  },
  [ProductCategory.HOP_SO_GIAM_TOC]: {
    label: "Hộp số giảm tốc",
    slug: "hop-so-giam-toc",
    description: "Bộ truyền giảm tốc đa tỉ số cho nhiều ứng dụng cơ khí."
  },
  [ProductCategory.DAU_GIAM_TOC]: {
    label: "Đầu giảm tốc",
    slug: "dau-giam-toc",
    description: "Đầu số ghép motor điện, tối ưu chi phí đầu tư ban đầu."
  }
} as const;

export function mapCategorySlugToEnum(slug?: string) {
  return Object.entries(categoryMeta).find(
    ([, value]) => value.slug === slug
  )?.[0] as ProductCategory | undefined;
}

export function serializeCategory(category: ProductCategory) {
  return {
    value: category,
    ...categoryMeta[category]
  };
}
