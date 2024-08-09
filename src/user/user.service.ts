import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';
import { UserEntity } from './entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create({ email, name, password }: CreateUserDTO) {
    password = await this.hashPassword(password);

    const user = this.usersRepository.create({
      email,
      name,
      password,
    });

    // First do the instance of operating database and after pass the variable or pass the variables into a array to do a lot of register(can pass a lot of instance like bulkCreate)
    return this.usersRepository.save(user).catch((error) => {
      const type = error.code;
      switch (type) {
        case '23505':
          throw new BadRequestException({ error: error.detail });
        default:
          throw new BadRequestException({ error });
      }
    });
  }

  async list() {
    return await this.usersRepository.find();
  }

  async getOne(id: string) {
    await this.existUser(id);
    return await this.usersRepository.findOneBy({ id });
  }

  async update({ name, email, password, role }: UpdateUserDTO, id: string) {
    await this.existUser(id);
    password = await this.hashPassword(password);

    await this.usersRepository.update(id, {
      name,
      email,
      password,
      role,
    });

    return await this.getOne(id);
  }

  async updatePartial(data: UpdatePatchUserDTO, id: string) {
    await this.existUser(id);

    if (data.password) {
      data.password = await this.hashPassword(data.password);
    }

    await this.usersRepository.update(id, data);
    return await this.getOne(id);
  }

  async delete(id: string) {
    await this.existUser(id);

    return this.usersRepository.delete(id);
  }

  async existUser(id: string) {
    const exist = await this.usersRepository.exists({
      where: { id },
    });

    if (!exist) {
      throw new NotFoundException(`The user ${id} not exist`);
    }
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }
}
