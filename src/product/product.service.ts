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

    let productHours = null;

    if (createProductDto?.productHours?.length) {
      productHours = JSON.parse(createProductDto?.productHours);
    }

    const product = {
      ...createProductDto,
      image: imageUrlData?.path || null,
      menuGroupId: Number(createProductDto.menuGroupId),
      isAdultOnly: createProductDto?.isAdultOnly
        ? JSON.parse(createProductDto.isAdultOnly)
        : false,
      price: JSON.parse(createProductDto.price) as number,
      alwaysAvailable: createProductDto.alwaysAvailable
        ? JSON.parse(createProductDto.alwaysAvailable)
        : false,
      productHours: productHours
        ? {
            create: productHours,
          }
        : undefined,
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
    const product = await this.prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        productHours: true,
      },
    });

    return {
      product: productFormaterHelper(product),
    };
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    image: Express.Multer.File,
  ) {
    let productHours = null;

    if (updateProductDto?.productHours?.length) {
      productHours = JSON.parse(updateProductDto?.productHours);

      await this.prisma.productHours.deleteMany({
        where: {
          productId: id,
        },
      });
    }

    const product = {
      ...updateProductDto,
      isAdultOnly: updateProductDto?.isAdultOnly
        ? JSON.parse(updateProductDto.isAdultOnly)
        : false,
      price: JSON.parse(updateProductDto.price) as number,
      alwaysAvailable: updateProductDto.alwaysAvailable
        ? JSON.parse(updateProductDto.alwaysAvailable)
        : false,
      productHours: productHours
        ? {
            create: productHours,
          }
        : undefined,
    };

    const hasRemoveImage = product.removeImage;

    delete product.removeImage;

    if (image || hasRemoveImage) {
      const productDb = await this.prisma.product.findUnique({
        where: {
          id,
        },
        select: {
          image: true,
        },
      });

      const path = productDb.image?.split('/').pop();

      if (productDb.image && !hasRemoveImage && path) {
        await this.storageService.delete('product', path);
      } else {
        if (hasRemoveImage) {
          await this.storageService.delete('product', path);

          product.image = null;
        }
      }

      if (!hasRemoveImage) {
        const newImage = await this.storageService.upload(
          'product',
          image,
          image.originalname,
        );

        product.image = newImage.path;
      }
    }

    const editedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: product,
    });

    return {
      product: productFormaterHelper(editedProduct),
    };
  }

  async remove(id: number) {
    const productDb = await this.prisma.product.findUnique({
      where: {
        id,
      },
      select: {
        image: true,
      },
    });

    if (!productDb) {
      throw new Error('Product not found');
    }

    if (productDb?.image) {
      const path = productDb.image.split('/').pop();

      await this.storageService.delete('product', path);
    }

    return this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
  async disable(id: number, disabled: boolean) {
    const product = await this.prisma.product.update({
      where: {
        id,
      },
      data: {
        disabled,
      },
    });

    return {
      product: productFormaterHelper(product),
    };
  }
}
