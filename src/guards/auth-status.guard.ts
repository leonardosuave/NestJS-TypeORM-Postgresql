import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class AuthStatusGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;
    try {
      if (authorization && authorization.startsWith('Bearer')) {
        const accessToken = authorization.split(' ')[1];
        const user = this.authService.isValidToken(accessToken);
        request.userStatus = user;
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
