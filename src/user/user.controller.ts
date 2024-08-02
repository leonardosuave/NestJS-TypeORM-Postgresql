import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/decorators/role.decorator';
import { AuthGuard } from 'src/guards/auth.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  @Roles(Role.ADMIN, Role.MASTER)
  @Post()
  async create(@Body() data: CreateUserDTO) {
    return this.UserService.create(data);
  }

  @Roles(Role.ADMIN, Role.MASTER)
  @Get()
  async read() {
    return this.UserService.list();
  }

  @Get(':id')
  async readOne(@Param() param) {
    const { id } = param;
    return this.UserService.getOne(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async updatePartial(
    @Body() { email, name, password, role }: UpdatePatchUserDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.UserService.updatePartial({ email, name, password, role }, id);
  }

  @Roles(Role.ADMIN, Role.MASTER)
  @Put(':id')
  async update(
    @Body() data: UpdateUserDTO,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.UserService.update(data, id);
  }

  @Roles(Role.ADMIN, Role.MASTER)
  @Delete(':id')
  async delete(@Param('id', ParseUUIDPipe) id: string) {
    return this.UserService.delete(id);
  }
}
