import { NestFactory } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { SeedService } from './seed.service';
import * as dotenv from 'dotenv';

dotenv.config();

// Runner without Module (This in use seed-runner.ts) - Its neccessary do the connection with database if dont want create a specific module to seed.

// Create Module - create a seed.module.ts, use imports: [TypeOrmModule.forFeature([UserEntity])] and SeedService in providers and exports config and after import SeedModule in app.module (delete @Module in seed-runner.ts and use only function bootstrap() with commands);

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [UserEntity],
      synchronize: ['local', 'dev'].includes(process.env.ENV),
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
class SeedModule {}

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const seedService = app.get(SeedService);
  await seedService.run();
  await app.close();
}

bootstrap();
