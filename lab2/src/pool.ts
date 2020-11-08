import { Pool } from 'pg';

const pool : Pool = new Pool({
    host: process.env.PGHOST || 'localhost',
    port: parseInt(process.env.PGPORT || '5432'),
    database: process.env.PGDATABASE || 'Blog',
    user: process.env.PGUSER || 'postgres',
    password: process.env.PGPASSWORD || '',
});

export default pool;