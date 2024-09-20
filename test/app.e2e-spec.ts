import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { registerAuthDTO } from '../src/testing/auth-register-dto.mock';
import { Role } from '../src/enums/role.enum';
import dataSource from '../typeorm/data-source';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(() => {
    app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Register new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerAuthDTO);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');
  });

  it('Try login with new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: registerAuthDTO.email,
        password: registerAuthDTO.password,
      });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.accessToken).toEqual('string');

    accessToken = response.body.accessToken;
  });

  it('Get infos by user logged', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me')
      .set('authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body.id).toEqual('string');
    expect(response.body.role).toEqual(Role.NORMAL);

    userId = response.body.id;
  });

  it('Get status user logged', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/me/status')
      .set('authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(typeof response.body.status).toEqual('boolean');
    expect(response.body.status).toEqual(true);
  });

  it('Get user list with not allowed access', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(403);
    expect(response.body.error).toEqual('Forbidden');
  });

  it('Update manually user to ADMIN role', async () => {
    const ds = await dataSource.initialize();
    const queryRunner = ds.createQueryRunner();

    await queryRunner.query(`
      UPDATE users SET role = '${Role.ADMIN}' WHERE id = '${userId}'
    `);

    const rows = await queryRunner.query(`
      SELECT * FROM users WHERE id = '${userId}'
    `);

    dataSource.destroy();

    expect(rows.length).toEqual(1);
    expect(rows[0].role).toEqual(Role.ADMIN);
  });

  it('Get user list with allowed access', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toEqual(200);
    expect(Array.isArray(response.body)).toEqual(true);
    expect(response.body.length).toEqual(1);
  });
});
