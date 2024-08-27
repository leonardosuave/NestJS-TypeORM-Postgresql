import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UploadedFiles,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
} from '@nestjs/common';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { AuthService } from './auth.service';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UserMEPartialDTO } from './dto/get-user-by-token.dto';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { join } from 'path';
import { UserService } from '../user/user.service';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthStatusGuard } from '../guards/auth-status.guard';
import { FileService } from '../file/file.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly fileService: FileService,
  ) {}

  @Post('login')
  async longin(@Body() { email, password }: AuthLoginDTO) {
    return await this.authService.login({ email, password });
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDTO) {
    return await this.authService.register(data);
  }

  @Post('forget-password')
  async forgetPassword(@Body() email: ForgetPasswordDTO) {
    await this.authService.forgetPassword(email);
    return;
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDTO) {
    await this.authService.resetPassword(data);
    return;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(
    @User() user: UserMEPartialDTO | UserMEPartialDTO[],
    @Request() { userByToken },
  ) {
    return { ...user, userByToken };
  }

  @UseGuards(AuthStatusGuard)
  @Get('me/status')
  async meStatus(@Request() request) {
    return { status: request.userStatus };
  }

  // ========== Upload images and files ==========

  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('photo')
  async uploadPhoto(
    @User() user: UserMEPartialDTO,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: 'image/png' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 70 }),
        ],
      }),
    )
    photo: Express.Multer.File,
  ) {
    const fileName = `photo-${user.id}.png`;

    try {
      await this.fileService.upload(photo, fileName);
      return { status: 'success' };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseInterceptors(FilesInterceptor('files'))
  @UseGuards(AuthGuard)
  @Post('files')
  async uploadFiles(
    @User() user: UserMEPartialDTO,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return files;
  }

  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'photo',
        maxCount: 1,
      },
      {
        name: 'documents',
        maxCount: 10,
      },
    ]),
  )
  @UseGuards(AuthGuard)
  @Post('files-fields')
  async uploadFilesFields(
    @User() user: UserMEPartialDTO,
    @UploadedFiles()
    files: { photo: Express.Multer.File; documents: Express.Multer.File[] },
  ) {
    return files;
  }
}
