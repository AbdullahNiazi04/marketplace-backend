import { Injectable, Inject } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DATABASE_CONNECTION } from '../../database/database.module.js';
import { companies, Company, NewCompany } from '../../db/schema/index.js';

@Injectable()
export class CompaniesRepository {
    constructor(@Inject(DATABASE_CONNECTION) private readonly db: any) { }

    async create(data: NewCompany): Promise<Company> {
        const result = await this.db.insert(companies).values(data).returning();
        return result[0];
    }

    async findAll(): Promise<Company[]> {
        return this.db.select().from(companies);
    }

    async findById(companyId: string): Promise<Company | undefined> {
        const result = await this.db.select().from(companies).where(eq(companies.companyId, companyId));
        return result[0];
    }

    async findByTaxId(taxId: string): Promise<Company | undefined> {
        const result = await this.db.select().from(companies).where(eq(companies.taxId, taxId));
        return result[0];
    }

    async update(companyId: string, data: Partial<NewCompany>): Promise<Company | undefined> {
        const result = await this.db
            .update(companies)
            .set({ ...data, updatedAt: new Date() })
            .where(eq(companies.companyId, companyId))
            .returning();
        return result[0];
    }

    async delete(companyId: string): Promise<boolean> {
        const result = await this.db.delete(companies).where(eq(companies.companyId, companyId)).returning();
        return result.length > 0;
    }
}
