import fs from 'fs/promises';
import path from 'path';
import { getDb } from '../src/api/database.js';

const MIGRATIONS_DIR = './migrations';

async function migrate() {
  const db = await getDb();
  const files = await fs.readdir(MIGRATIONS_DIR);
  files.sort();

  for (const file of files) {
    if (file.endsWith('.sql')) {
      console.log(`Running migration: ${file}`);
      const content = await fs.readFile(path.join(MIGRATIONS_DIR, file), 'utf-8');
      await db.exec(content);
    }
  }

  console.log('Migrations completed.');
  await db.close();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
