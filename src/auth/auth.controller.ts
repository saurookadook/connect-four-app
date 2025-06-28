import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { type Request } from 'express';

import {
  AuthenticationRequestDTO,
  RegisterDTO,
  LoginDTO,
} from './dtos/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(@Body() requestData: AuthenticationRequestDTO) {
    const dataAsDTO = plainToInstance(RegisterDTO, requestData);
    return this.authenticationService.register(dataAsDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body() requestData: AuthenticationRequestDTO) {
    const dataAsDTO = plainToInstance(LoginDTO, requestData);
    return this.authenticationService.login(dataAsDTO);
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    // const playerID = req.user.playerID;
    // return this.authenticationService.logout(playerID);
    return req.logout();
  }
}
