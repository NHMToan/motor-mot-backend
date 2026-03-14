import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./modules/auth/auth.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { PrismaModule } from "./common/prisma/prisma.module";
import { ProductsModule } from "./modules/products/products.module";
import { UploadsModule } from "./modules/uploads/uploads.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    PrismaModule,
    AuthModule,
    CategoriesModule,
    ProductsModule,
    UploadsModule
  ]
})
export class AppModule {}
