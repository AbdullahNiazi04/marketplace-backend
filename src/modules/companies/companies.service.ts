import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto, UpdateCompanyDto } from './dto';
import { Company } from '../../db/schema';

@Injectable()
export class CompaniesService {
    constructor(private readonly companiesRepository: CompaniesRepository) { }

    async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
        const existing = await this.companiesRepository.findByTaxId(createCompanyDto.taxId);
        if (existing) {
            throw new ConflictException('Company with this Tax ID already exists');
        }
        return this.companiesRepository.create(createCompanyDto);
    }

    async findAll(): Promise<Company[]> {
        return this.companiesRepository.findAll();
    }

    async findOne(id: string): Promise<Company> {
        const company = await this.companiesRepository.findById(id);
        if (!company) {
            throw new NotFoundException(`Company with ID ${id} not found`);
        }
        return company;
    }

    async update(id: string, updateCompanyDto: UpdateCompanyDto): Promise<Company> {
        await this.findOne(id);
        const updated = await this.companiesRepository.update(id, updateCompanyDto);
        return updated!;
    }

    async remove(id: string): Promise<void> {
        await this.findOne(id);
        await this.companiesRepository.update(id, { isActive: false });
    }

    async updateCreditBalance(id: string, amount: number): Promise<Company> {
        const company = await this.findOne(id);
        const newBalance = (company.creditBalance || 0) + amount;
        const updated = await this.companiesRepository.update(id, { creditBalance: newBalance });
        return updated!;
    }
}
