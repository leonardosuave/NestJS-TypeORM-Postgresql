import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

export class UserIdCheckMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (!isUUID(req.params.id)) {
      throw new BadRequestException('ID inválidado!');
    }

    next();
  }
}
