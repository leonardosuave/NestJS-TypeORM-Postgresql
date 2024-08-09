import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Migrate1723208201369 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '63',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '127',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '127',
          },
          {
            name: 'role',
            type: 'enum',
            enum: ['NORMAL', 'ADMIN', 'MASTER'],
            default: `'NORMAL'`,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
