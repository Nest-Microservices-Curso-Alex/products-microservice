import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma.service';
import { PaginationDto } from 'src/common';
// import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductService');

  constructor(private prisma: PrismaService) {}

  create(createProductDto: CreateProductDto) {
    const product = this.prisma.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    const totalPages = await this.prisma.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.prisma.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        total: totalPages,
        page,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id,
        available: true,
      },
    });

    if (!product)
      throw new NotFoundException(`Product with id: #${id} not found`);

    return product;
  }

  async update(updateProductDto: UpdateProductDto) {
    const { id, ...data } = updateProductDto;
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // hard deleted
    // return this.prisma.product.delete({
    //   where: { id },
    // });

    const product = await this.prisma.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }
}
