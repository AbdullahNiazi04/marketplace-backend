import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
    constructor(private readonly companiesService: CompaniesService) { }

    @Post()
    @ApiOperation({ summary: 'Register a new B2B company' })
    @ApiResponse({ status: 201, description: 'Company registered successfully' })
    create(@Body() createCompanyDto: CreateCompanyDto) {
        return this.companiesService.create(createCompanyDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all companies' })
    findAll() {
        return this.companiesService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get company by ID' })
    findOne(@Param('id') id: string) {
        return this.companiesService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update company' })
    update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
        return this.companiesService.update(id, updateCompanyDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete company (soft delete)' })
    remove(@Param('id') id: string) {
        return this.companiesService.remove(id);
    }
}
