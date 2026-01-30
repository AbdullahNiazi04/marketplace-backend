import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';
import { Category } from '../../db/schema';

@Injectable()
export class CategoriesService {
    constructor(private readonly categoriesRepository: CategoriesRepository) { }

    async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
        const existing = await this.categoriesRepository.findBySlug(createCategoryDto.slug);
        if (existing) {
            throw new ConflictException('Category with this slug already exists');
        }
        return this.categoriesRepository.create(createCategoryDto);
    }

    async findAll(): Promise<Category[]> {
        return this.categoriesRepository.findAll();
    }

    async findOne(id: string): Promise<Category> {
        const category = await this.categoriesRepository.findById(id);
        if (!category) {
            throw new NotFoundException(`Category with ID ${id} not found`);
        }
        return category;
    }

    async findRootCategories(): Promise<Category[]> {
        return this.categoriesRepository.findRootCategories();
    }

    async findSubcategories(parentId: string): Promise<Category[]> {
        return this.categoriesRepository.findByParentId(parentId);
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        await this.findOne(id);
        const updated = await this.categoriesRepository.update(id, updateCategoryDto);
        return updated!;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.categoriesRepository.update(id, { isActive: false });
    }
}
