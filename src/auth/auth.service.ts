import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { ForgetPasswordDTO } from './dto/forget-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer/dist';
import { UserEntity } from 'src/user/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly mailer: MailerService,
  ) {}

  createToken(user: UserEntity) {
    return {
      accessToken: this.jwtService.sign(
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        {
          expiresIn: '12h',
          subject: user.id,
          issuer: 'login',
          audience: 'users',
        },
      ),
    };
  }

  checkToken(token: string) {
    try {
      return this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'login',
      });
    } catch (error) {
      throw new BadRequestException({ error });
    }
  }

  isValidToken(token: string) {
    try {
      this.checkToken(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email not found.');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedException('Email or Password incorrects.');
    }

    return this.createToken(user);
  }

  async forgetPassword({ email }: ForgetPasswordDTO) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email incorrect.');
    }

    const token = this.jwtService.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '30 minutes',
        subject: user.id,
        issuer: 'forget',
        audience: 'users',
      },
    );

    await this.mailer.sendMail({
      subject: 'Password Recovery',
      to: user.email,
      template: 'forget',
      context: {
        name: user.name,
        token: token,
      },
    });

    return true;
  }

  async resetPassword({ password, token }: ResetPasswordDTO) {
    try {
      const { id } = this.jwtService.verify(token, {
        audience: 'users',
        issuer: 'forget',
      });

      const hashPassword = await this.userService.hashPassword(password);
      await this.usersRepository.update(id, {
        password: hashPassword,
      });

      const user = await this.userService.getOne(id);

      return this.createToken(user);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async register(data: AuthRegisterDTO) {
    const user = await this.userService.create(data);
    return this.createToken(user);
  }
}
