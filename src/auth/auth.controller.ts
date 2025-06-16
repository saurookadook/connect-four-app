import { Body, Controller, Get, Query, Param, Post } from '@nestjs/common';

import { RegisterDTO, LoginDTO } from './dtos/auth.dto';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDTO) {
    console.log({
      registrationData,
    });
    return this.authenticationService.register({
      username: registrationData.username,
      unhashedPassword: registrationData.unhashedPassword,
    });
  }

  @Post('login')
  async login(@Body() loginData: LoginDTO) {
    return this.authenticationService.login({
      username: loginData.username,
      unhashedPassword: loginData.unhashedPassword,
    });
  }
}
