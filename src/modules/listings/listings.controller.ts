import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import { CreateListingDto, UpdateListingDto } from './dto';
import { RolesGuard, Roles, Public, UserSession } from '../../common';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) { }

    @Post()
    @UseGuards(RolesGuard)
    @Roles('Seller', 'Admin')
    @ApiOperation({ summary: 'Create a new listing (Seller/Admin only)' })
    create(@Body() createListingDto: CreateListingDto, @UserSession() session: any) {
        // Set seller ID from authenticated user
        createListingDto.sellerId = session.user.id;
        return this.listingsService.create(createListingDto);
    }

    @Get()
    @Public()
    @ApiOperation({ summary: 'Get all listings (Public)' })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'offset', required: false })
    findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
        return this.listingsService.findAll(limit, offset);
    }

    @Get('search')
    @Public()
    @ApiOperation({ summary: 'Search listings (Public)' })
    @ApiQuery({ name: 'q', required: true })
    search(@Query('q') query: string) {
        return this.listingsService.search(query);
    }

    @Get('seller/:sellerId')
    @Public()
    @ApiOperation({ summary: 'Get listings by seller (Public)' })
    findBySeller(@Param('sellerId') sellerId: string) {
        return this.listingsService.findBySeller(sellerId);
    }

    @Get('category/:categoryId')
    @Public()
    @ApiOperation({ summary: 'Get listings by category (Public)' })
    findByCategory(@Param('categoryId') categoryId: string) {
        return this.listingsService.findByCategory(categoryId);
    }

    @Get(':id')
    @Public()
    @ApiOperation({ summary: 'Get listing by ID (Public)' })
    findOne(@Param('id') id: string) {
        return this.listingsService.findOne(id);
    }

    @Patch(':id')
    @UseGuards(RolesGuard)
    @Roles('Seller', 'Admin')
    @ApiOperation({ summary: 'Update listing (Seller/Admin only)' })
    update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
        return this.listingsService.update(id, updateListingDto);
    }

    @Delete(':id')
    @UseGuards(RolesGuard)
    @Roles('Seller', 'Admin')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete listing (Seller/Admin only)' })
    remove(@Param('id') id: string) {
        return this.listingsService.remove(id);
    }
}
