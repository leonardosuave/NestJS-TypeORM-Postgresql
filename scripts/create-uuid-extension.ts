// Script used to add uuid-ossp extention to allow used uuid_generate_v4();

import dataSource from '../typeorm/data-source';

const createUuidExtension = async () => {
  const db = await dataSource.initialize();
  await db.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);
  await db.destroy();
};

createUuidExtension().catch(console.error);