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
  async register(
    @Req() req: Request,
    @Body() requestData: AuthenticationRequestDTO,
  ) {
    const dataAsDTO = plainToInstance(RegisterDTO, requestData);
    const playerDetails = await this.authenticationService.register(dataAsDTO);
    req.login(playerDetails, (err) => {
      if (err) {
        throw new Error('Login failed after registration.');
      }
      // should this redirect somewhere?
    });
    return playerDetails;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Body() requestData: AuthenticationRequestDTO,
  ) {
    const dataAsDTO = plainToInstance(LoginDTO, requestData);
    const playerDetails = await this.authenticationService.login(dataAsDTO);
    req.login(playerDetails, (err) => {
      if (err) {
        throw new Error('Login failed.');
      }
      // should this redirect somewhere?
    });
    return playerDetails;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    // const playerID = req.user.playerID;
    // return this.authenticationService.logout(playerID);
    return req.logout();
  }
}
