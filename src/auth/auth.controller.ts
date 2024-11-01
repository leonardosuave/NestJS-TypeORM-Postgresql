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
  Patch,
  Param,
  Delete,
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
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import { AuthStatusGuard } from '../guards/auth-status.guard';
import { FileService } from '../file/file.service';
import { FirebaseService } from '../firebase/firebase.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly fileService: FileService,
    private readonly firebaseService: FirebaseService,
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
    return await this.authService.forgetPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDTO) {
    return await this.authService.resetPassword(data);
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

  // ========== FIREBASE =========
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(AuthGuard)
  @Post('firebase-photo')
  async uploadPhotoFirebase(
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
    try {
      const destination = `${process.env.ENV}/users/${
        user.id
      }/${Date.now()}.png`;

      return await this.firebaseService.uploadFile(photo.buffer, destination);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Patch('firebase-photo/:fileName')
  async selectPhoto(
    @User() user: UserMEPartialDTO,
    @Param('fileName') fileName: string,
  ) {
    const destination = `${process.env.ENV}/users/${user.id}/`;
    try {
      return await this.firebaseService.updateSelectPhoto(
        destination,
        fileName,
      );
    } catch (error) {
      const errorType: string = error.message;
      if (errorType.includes('No such object')) {
        throw new BadRequestException('The file can not be selected.', {
          description: `File ${fileName} not found.`,
        });
      }
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Delete('firebase-photo/:fileName')
  async deletePhoto(
    @User() user: UserMEPartialDTO,
    @Param('fileName') fileName: string,
  ) {
    const destination = `${process.env.ENV}/users/${user.id}/${fileName}`;
    try {
      await this.firebaseService.deletePhoto(destination);
    } catch (error) {
      const errorType: string = error.message;
      if (errorType.includes('No such object')) {
        throw new BadRequestException('The file can not be deleted.', {
          description: `File ${fileName} not found.`,
        });
      }
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AuthGuard)
  @Get('firebase-photos')
  async getFilesPath(@User() user: UserMEPartialDTO) {
    return await this.firebaseService.getFilesPath(user.id);
  }

  @UseGuards(AuthGuard)
  @Get('firebase-photo-selected')
  async getFilePath(@User() user: UserMEPartialDTO) {
    // Pega a ultima foto enviada através do timestamp do nome da imagem
    const files = await this.firebaseService.getFilesPath(user.id);
    return { file: files.sort().reverse()[0] };
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
