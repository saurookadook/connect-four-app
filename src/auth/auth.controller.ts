import { Body, Controller, Post } from '@nestjs/common';

import {
  AuthenticationRequestDTO,
  RegisterDTO,
  LoginDTO,
} from './dtos/auth.dto';
import { AuthenticationService } from './authentication.service';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() requestData: AuthenticationRequestDTO) {
    const dataAsDTO = plainToInstance(RegisterDTO, requestData);
    return this.authenticationService.register({
      username: dataAsDTO.username,
      unhashedPassword: dataAsDTO.unhashedPassword,
    });
  }

  @Post('login')
  async login(@Body() requestData: AuthenticationRequestDTO) {
    const dataAsDTO = plainToInstance(LoginDTO, requestData);
    return this.authenticationService.login({
      username: dataAsDTO.username,
      unhashedPassword: dataAsDTO.unhashedPassword,
    });
  }
}
