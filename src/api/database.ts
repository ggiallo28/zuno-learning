import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const DB_FILE = './zuno.db';

let db: any = null;

export async function getDb() {
  if (db) {
    return db;
  }

  db = await open({
    filename: DB_FILE,
    driver: sqlite3.Database,
  });

  return db;
}
