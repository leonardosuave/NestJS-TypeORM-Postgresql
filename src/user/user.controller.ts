import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Role } from '../enums/role.enum';
import { Roles } from '../decorators/role.decorator';

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(Role.ADMIN, Role.MASTER)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.userService.create(data);
  }

  @Roles(Role.ADMIN, Role.MASTER)
  @Get()
  async read() {
    return this.userService.list();
  }

  @Get(':id')
  async readOne(@Param() param) {
    const { id } = param;
    return this.userService.getOne(id);
  }

  @Roles(Role.ADMIN, Role.MASTER)
  @Patch(':id')
  async updatePartial(
    @Body() { email, name, password, role }: UpdatePatchUserDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.userService.updatePartial({ email, name, password, role }, id);
  }

  @Roles(Role.ADMIN, Role.MASTER)
  @Put(':id')
  async update(
    @Body() data: UpdateUserDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.userService.update(data, id);
  }

  @Roles(Role.ADMIN, Role.MASTER)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.delete(id);
  }
}
