import { MongoClient } from 'mongodb';
import type { Schema } from './schema.js';

export async function connect() {
  const client = new MongoClient('mongodb://localhost:27017');
  await client.connect();
  return client;
}
export function collection(
  client: MongoClient,
  dbName: keyof Schema
) {
  const database = client.db('dev_db');
  return database.collection<Schema[typeof dbName]>(dbName);
}
