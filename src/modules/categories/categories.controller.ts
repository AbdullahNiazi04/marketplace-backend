import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service.js';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/index.js';
import { RolesGuard, Roles, Public } from '../../common/index.js';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('Admin')
    @ApiOperation({ summary: 'Create a new category (Admin only)' })
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoriesService.create(createCategoryDto);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all categories (Public)' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Get('roots')
    @Public()
    @ApiOperation({ summary: 'Get root categories (Public)' })
    findRoots() {
        return this.categoriesService.findRootCategories();
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Get category by ID (Public)' })
    findOne(@Param('id') id: string) {
        return this.categoriesService.findOne(id);
    }

    @Get(':id/subcategories')
    @Public()
    @ApiOperation({ summary: 'Get subcategories (Public)' })
    findSubcategories(@Param('id') id: string) {
        return this.categoriesService.findSubcategories(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('Admin')
    @ApiOperation({ summary: 'Update category (Admin only)' })
    update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoriesService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('Admin')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete category (Admin only)' })
    remove(@Param('id') id: string) {
        return this.categoriesService.remove(id);
    }
}
