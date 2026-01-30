import { Module, Global } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as pg from 'pg';
const { Pool } = pg;
import * as schema from './schema/index.js';

export const DATABASE_CONNECTION = 'DATABASE_CONNECTION';

@Global()
@Module({
    providers: [
        {
            provide: DATABASE_CONNECTION,
            useFactory: () => {
                const connectionString = process.env.DATABASE_URL;
                if (!connectionString) {
                  throw new Error('DATABASE_URL is not defined');
                }
                const pool = new Pool({
                    connectionString,
                });

                return drizzle(pool, { schema });
            },
        },
    ],
    exports: [DATABASE_CONNECTION],
})
export class DatabaseModule { }
