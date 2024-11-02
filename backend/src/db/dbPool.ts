import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://postgres:postgres@database:5432/digital_closet',
});

export default pool;