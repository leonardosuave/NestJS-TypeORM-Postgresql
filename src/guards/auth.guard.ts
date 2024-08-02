import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      if (authorization && authorization.startsWith('Bearer')) {
        const accessToken = authorization.split(' ')[1];
        const data = this.authService.checkToken(accessToken);
        request.userByToken = data;
        request.user = await this.userService.getOne(data.id);
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
