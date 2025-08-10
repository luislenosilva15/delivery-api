/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StorageService } from 'src/storage/storage.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { productFormaterHelper } from 'src/helpers/product-formater-helper';

@Injectable()
export class ProductService {
  constructor(
    private readonly storageService: StorageService,
    private readonly prisma: PrismaService,
  ) {}
  async create(createProductDto: CreateProductDto, image: Express.Multer.File) {
    const imageUrlData =
      image &&
      (await this.storageService.upload('product', image, image.originalname));

    const product = {
      ...createProductDto,
      image: imageUrlData?.path || null,
      menuGroupId: Number(createProductDto.menuGroupId),
      isAdultOnly: createProductDto?.isAdultOnly
        ? JSON.parse(createProductDto.isAdultOnly)
        : false,
      price: JSON.parse(createProductDto.price) as number,
    };

    const productData = await this.prisma.product.create({
      data: product,
    });

    return {
      product: productFormaterHelper(productData),
    };
  }

  async findAll(menuGroupId: number) {
    const products = await this.prisma.product.findMany({
      where: {
        menuGroupId,
      },
    });

    return {
      products: products.map((product) => productFormaterHelper(product)),
    };
  }

  async findOne(id: number) {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
