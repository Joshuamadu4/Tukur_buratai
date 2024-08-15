import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from './admin.dto';

export const User = createParamDecorator(
  <T extends keyof RequestWithUser['user']>(data: T, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest() as RequestWithUser;

    const user = request.user;

    return data ? (user && user[data]) : user;
  },
);


// export const User = createParamDecorator(
//     (data: unknown, context: ExecutionContext): UserWithID => {
//       const request = context.switchToHttp().getRequest();
//       return request.user as UserWithID; // Explicit casting
//     },
//   );