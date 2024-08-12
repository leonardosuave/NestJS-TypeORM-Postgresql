import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, EntityMetadata, Repository } from 'typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private readSeedData(file): DeepPartial<UserEntity>[] {
    const filePath = path.join(__dirname, 'data', file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  }

  private getTableName(repository: Repository<any>): string {
    const metadata = repository.metadata as EntityMetadata;
    return metadata.tableName;
  }

  async seedEntity<T>(
    repository: Repository<T>,
    data: DeepPartial<any>[],
    uniqueField: keyof T,
  ): Promise<void> {
    const tableName = this.getTableName(repository);
    console.log(
      `Preparing to insert ${data.length} record into table: ${tableName}`,
    );
    for (const item of data) {
      const exists = await repository.findOneBy({
        [uniqueField]: item[uniqueField],
      } as any);
      if (!exists) {
        if (tableName === 'users') {
          const salt = await bcrypt.genSalt();
          item.password = await bcrypt.hash(item.password, salt);
        }
        await repository.save(item);
      }
    }
    console.log(`Inserted record into table: ${tableName}`);
  }

  async run() {
    await this.seedEntity(
      this.userRepository,
      this.readSeedData('users.seed.json'),
      'email',
    );
  }
}
