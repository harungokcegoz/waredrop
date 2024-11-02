import { Pool, PoolClient } from 'pg';
import fs from 'fs/promises';
import path from 'path';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'digital_closet';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASSWORD = process.env.DB_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'database';
const DB_PORT = process.env.DB_PORT || '5432';

const pool = new Pool({
  user: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: parseInt(DB_PORT),
  database: 'postgres', // Connect to default postgres database initially
});

async function initDb(): Promise<void> {
  let client: PoolClient | null = null;

  try {
    client = await pool.connect();

    // Check if the database exists
    const dbExists = await checkDatabaseExists(client, DB_NAME);
    
    if (!dbExists) {
      // Create the database if it doesn't exist
      await client.query(`CREATE DATABASE ${DB_NAME}`);
      logger.info(`Database ${DB_NAME} created successfully`);
    } else {
      logger.warn(`Database ${DB_NAME} already exists`);
    }
  } catch (err) {
    logger.error('Error checking/creating database:', err);
    throw err;
  } finally {
    if (client) client.release();
    await pool.end();
  }

  // Connect to the newly created or existing database
  const dbPool = new Pool({
    user: DB_USER,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: parseInt(DB_PORT),
    database: DB_NAME,
  });

  try {
    const dbClient = await dbPool.connect();
    
    // Execute the SQL script
    const sqlScript = await fs.readFile(path.join(__dirname, 'init.sql'), 'utf8');
    await dbClient.query(sqlScript);
    logger.info('Database initialized successfully');
    
    dbClient.release();
  } catch (err) {
    logger.error('Error initializing database:', err);
    throw err;
  } finally {
    await dbPool.end();
  }
}

async function checkDatabaseExists(client: PoolClient, dbName: string): Promise<boolean> {
  const res = await client.query(
    'SELECT 1 FROM pg_database WHERE datname = $1',
    [dbName]
  );
  return res.rowCount ? res.rowCount > 0 : false;
}

initDb().catch(err => {
  logger.error('Database initialization failed:', err);
  process.exit(1);
});