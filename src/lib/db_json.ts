import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data_store.json');

// Initial Data Structure
const INITIAL_DATA = {
  users: [],
  signals: [],
  messages: []
};

// Helper to ensure DB exists
const ensureDb = () => {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_DATA, null, 2));
  }
};

export const getDb = () => {
  ensureDb();
  const data = fs.readFileSync(DB_PATH, 'utf8');
  return JSON.parse(data);
};

export const saveDb = (data: any) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

export const clearDb = () => {
  saveDb(INITIAL_DATA);
};
