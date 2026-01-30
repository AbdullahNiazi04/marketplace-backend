import { Controller, All, Req, Res } from '@nestjs/common';
import { auth } from '../../lib/auth';
import { toNodeHandler } from 'better-auth/node';

@Controller('api/auth')
export class AuthController {
  @All('*')
  async toNodeHandler(@Req() req, @Res() res) {
    const authInstance = await auth;
    return toNodeHandler(authInstance)(req, res);
  }
}
