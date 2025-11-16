import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDocument } from '../../user/schemas';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: UserDocument;
}

export const CurrentUser = createParamDecorator(
  (ctx: ExecutionContext): UserDocument => {
    const request: AuthenticatedRequest = ctx.switchToHttp().getRequest();
    return request?.user;
  },
);
