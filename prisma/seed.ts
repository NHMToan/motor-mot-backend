import { PrismaClient, ProductCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Motor Giảm Tốc Chân Đế 1.5kW",
    slug: "motor-giam-toc-chan-de-1-5kw",
    category: ProductCategory.MOTOR_GIAM_TOC,
    sku: "MM-MGT-1500",
    summary: "Giải pháp truyền động ổn định cho băng tải và máy đóng gói.",
    description:
      "Motor giảm tốc chân đế thiết kế gọn, mô-men xoắn cao, phù hợp dây chuyền sản xuất hoạt động liên tục.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "Motor giảm tốc chân đế 1.5kW phù hợp băng tải, máy đóng gói và dây chuyền cần vận hành liên tục."
      },
      {
        type: "bullets",
        items: [
          "Mô-men xoắn lớn, chạy ổn định.",
          "Dễ bảo trì trong môi trường xưởng.",
          "Phù hợp hệ truyền động tải vừa."
        ]
      }
    ],
    galleryImages: [],
    price: 6800000,
    featured: true,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Motor Giảm Tốc Mặt Bích 2.2kW",
    slug: "motor-giam-toc-mat-bich-2-2kw",
    category: ProductCategory.MOTOR_GIAM_TOC,
    sku: "MM-MGT-2200",
    summary: "Lắp đặt gọn cho dây chuyền đóng gói và băng tải nghiêng.",
    description:
      "Motor giảm tốc mặt bích 2.2kW cho khả năng truyền động ổn định, tối ưu không gian lắp đặt và dễ ghép với nhiều hệ cơ khí.",
    descriptionBlocks: [
      {
        type: "heading",
        content: "Ứng dụng thực tế"
      },
      {
        type: "paragraph",
        content:
          "Phù hợp cho băng tải nghiêng, máy trộn, cụm truyền động cần mô-men ổn định và kích thước gọn."
      }
    ],
    galleryImages: [],
    price: 8450000,
    featured: true,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Motor Giảm Tốc Trục Song Song 3.7kW",
    slug: "motor-giam-toc-truc-song-song-3-7kw",
    category: ProductCategory.MOTOR_GIAM_TOC,
    sku: "MM-MGT-3700",
    summary: "Giải pháp tải nặng cho băng tải dài và hệ nâng chuyển hàng.",
    description:
      "Motor giảm tốc trục song song 3.7kW được lựa chọn nhiều trong hệ tải lớn nhờ độ bền cao, dễ bảo trì và hiệu suất ổn định.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "Dòng này thích hợp cho các hệ cần làm việc liên tục, tải nặng và yêu cầu tuổi thọ vận hành cao."
      }
    ],
    galleryImages: [],
    price: 12600000,
    featured: false,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Motor Giảm Tốc Cốt Âm 0.75kW",
    slug: "motor-giam-toc-cot-am-0-75kw",
    category: ProductCategory.MOTOR_GIAM_TOC,
    sku: "MM-MGT-0750",
    summary: "Dễ lắp trực tiếp vào trục máy, tiết kiệm không gian truyền động.",
    description:
      "Motor giảm tốc cốt âm 0.75kW phù hợp hệ tải nhỏ và trung bình, đặc biệt ở các cụm máy cần lắp gọn và giảm phụ kiện ghép nối.",
    descriptionBlocks: [
      {
        type: "bullets",
        items: [
          "Thiết kế gọn.",
          "Phù hợp tải vừa và nhỏ.",
          "Dễ lắp vào cụm máy hiện hữu."
        ]
      }
    ],
    galleryImages: [],
    price: 5100000,
    featured: false,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hộp Số Giảm Tốc Trục Vít NMRV 090",
    slug: "hop-so-giam-toc-truc-vit-nmrv-090",
    category: ProductCategory.HOP_SO_GIAM_TOC,
    sku: "MM-HSGT-090",
    summary: "Vận hành êm, tối ưu không gian lắp đặt cho xưởng cơ khí.",
    description:
      "Hộp số giảm tốc trục vít NMRV 090 phù hợp máy khuấy, máy đóng gói và hệ thống băng tải tải trọng trung bình.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "Hộp số giảm tốc NMRV 090 được ưa chuộng vì nhỏ gọn, vận hành êm và lắp đặt linh hoạt."
      }
    ],
    galleryImages: [],
    price: 3200000,
    featured: true,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hộp Số Giảm Tốc WPA 80",
    slug: "hop-so-giam-toc-wpa-80",
    category: ProductCategory.HOP_SO_GIAM_TOC,
    sku: "MM-HSGT-WPA80",
    summary: "Thiết kế cổ điển, bền bỉ cho nhiều ứng dụng cơ khí dân dụng và công nghiệp.",
    description:
      "Hộp số giảm tốc WPA 80 phù hợp máy khuấy, máy nâng hạ nhẹ và các cụm truyền động cần tỷ số truyền ổn định.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "WPA 80 là dòng hộp số phổ biến vì dễ thay thế, phụ tùng sẵn và vận hành ổn định."
      }
    ],
    galleryImages: [],
    price: 2950000,
    featured: false,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1530543787849-128d94430c6b?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hộp Số Giảm Tốc WPDA 100",
    slug: "hop-so-giam-toc-wpda-100",
    category: ProductCategory.HOP_SO_GIAM_TOC,
    sku: "MM-HSGT-WPDA100",
    summary: "Tăng mô-men hiệu quả cho hệ khuấy và hệ băng tải tải trung bình.",
    description:
      "WPDA 100 là lựa chọn cân bằng giữa độ bền, chi phí đầu tư và khả năng lắp đặt linh hoạt trong nhà xưởng.",
    descriptionBlocks: [
      {
        type: "heading",
        content: "Lý do khách hàng hay chọn"
      },
      {
        type: "bullets",
        items: [
          "Giá đầu tư hợp lý.",
          "Linh kiện dễ thay.",
          "Phù hợp nhiều loại khung máy."
        ]
      }
    ],
    galleryImages: [],
    price: 4350000,
    featured: true,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1580906855284-9f4062a5625a?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Hộp Số Giảm Tốc Côn Xoắn 2 Cấp",
    slug: "hop-so-giam-toc-con-xoan-2-cap",
    category: ProductCategory.HOP_SO_GIAM_TOC,
    sku: "MM-HSGT-CX2C",
    summary: "Hiệu suất cao, thích hợp dây chuyền hoạt động liên tục.",
    description:
      "Dòng hộp số côn xoắn 2 cấp cho độ êm, độ bền và hiệu suất tốt hơn ở các hệ đòi hỏi tải ổn định trong thời gian dài.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "Giải pháp phù hợp cho doanh nghiệp muốn tối ưu tuổi thọ vận hành và hiệu suất truyền động."
      }
    ],
    galleryImages: [],
    price: 9800000,
    featured: false,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1565043666747-69f6646db940?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Đầu Giảm Tốc Cốt Âm Tỉ Số 1/30",
    slug: "dau-giam-toc-cot-am-ti-so-1-30",
    category: ProductCategory.DAU_GIAM_TOC,
    sku: "MM-DGT-130",
    summary: "Tăng mô-men hiệu quả cho hệ truyền động công nghiệp nhẹ.",
    description:
      "Đầu giảm tốc cốt âm tỉ số truyền 1/30 thích hợp ghép motor điện phổ thông để vận hành ổn định và tiết kiệm chi phí.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "Đầu giảm tốc cốt âm giúp tăng mô-men cho nhiều ứng dụng truyền động dân dụng và công nghiệp nhẹ."
      }
    ],
    galleryImages: [],
    price: 2450000,
    featured: false,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1532614338840-ab30cf10ed36?auto=format&fit=crop&w=1200&q=80"
  }
  ,
  {
    name: "Đầu Giảm Tốc Cốt Dương Tỉ Số 1/20",
    slug: "dau-giam-toc-cot-duong-ti-so-1-20",
    category: ProductCategory.DAU_GIAM_TOC,
    sku: "MM-DGT-120",
    summary: "Phù hợp ghép motor điện cho hệ tải nhẹ đến trung bình.",
    description:
      "Đầu giảm tốc cốt dương tỉ số 1/20 dễ lắp, dễ thay thế và được dùng nhiều trong cụm truyền động phổ thông.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "Giải pháp tiết kiệm chi phí cho xưởng cần nâng cấp mô-men nhưng vẫn tận dụng motor điện sẵn có."
      }
    ],
    galleryImages: [],
    price: 2250000,
    featured: false,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Đầu Giảm Tốc Trục Vuông Góc 1/40",
    slug: "dau-giam-toc-truc-vuong-goc-1-40",
    category: ProductCategory.DAU_GIAM_TOC,
    sku: "MM-DGT-140",
    summary: "Bố trí truyền động vuông góc gọn gàng, phù hợp cụm máy hẹp.",
    description:
      "Đầu giảm tốc trục vuông góc 1/40 được dùng khi không gian lắp đặt hạn chế nhưng vẫn cần tỷ số truyền lớn.",
    descriptionBlocks: [
      {
        type: "bullets",
        items: [
          "Bố trí vuông góc tiết kiệm chỗ.",
          "Tỷ số truyền lớn.",
          "Phù hợp máy băng tải nhỏ và máy khuấy."
        ]
      }
    ],
    galleryImages: [],
    price: 3180000,
    featured: true,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Đầu Giảm Tốc Mini 1/10",
    slug: "dau-giam-toc-mini-1-10",
    category: ProductCategory.DAU_GIAM_TOC,
    sku: "MM-DGT-110",
    summary: "Nhỏ gọn cho các ứng dụng tự động hóa và cơ cấu mini.",
    description:
      "Đầu giảm tốc mini 1/10 thích hợp cho các cụm máy nhỏ, băng tải mini và hệ cơ điện cần bộ truyền đơn giản, kinh tế.",
    descriptionBlocks: [
      {
        type: "paragraph",
        content:
          "Phù hợp các dự án DIY, máy đóng gói mini và các hệ tự động hóa tải thấp."
      }
    ],
    galleryImages: [],
    price: 1680000,
    featured: false,
    active: true,
    imageUrl:
      "https://images.unsplash.com/photo-1494412685616-a5d310fbb07d?auto=format&fit=crop&w=1200&q=80"
  }
];

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@motormot.vn";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "12345678";
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      fullName: "Motor Một Admin"
    },
    create: {
      email: adminEmail,
      passwordHash,
      fullName: "Motor Một Admin"
    }
  });

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
