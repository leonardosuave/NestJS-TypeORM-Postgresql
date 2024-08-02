import {
  ExecutionContext,
  NotFoundException,
  createParamDecorator,
} from '@nestjs/common';

export const User = createParamDecorator(
  (filter: string | string[], context: ExecutionContext) => {
    //filter is a array or string sended in Decorator @User in the route - @User(['email', 'name']), @User('name')

    const request = context.switchToHttp().getRequest();

    if (!request.user) {
      throw new NotFoundException(
        'User not found. Use the AuthGuard to get user.',
      );
    }

    const userFilted = {};
    if (Array.isArray(filter)) {
      filter.forEach((d) => (userFilted[d] = request.user[d]));
      return (request.user = userFilted);
    } else if (filter) {
      userFilted[filter] = request.user[filter];
      return (request.user = userFilted);
    }
    return request.user;
  },
);
