import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { type Request, type Response } from 'express';

import { PlayerDetails } from '@/types/main';
import {
  AuthenticationRequestDTO,
  RegisterDTO,
  LoginDTO,
} from './dtos/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('register')
  async register(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() requestData: AuthenticationRequestDTO,
  ) {
    const dataAsDTO = plainToInstance(RegisterDTO, requestData);
    const playerDetails = await this.authenticationService.register(dataAsDTO);

    this._handlePassportLogin({
      req,
      playerDetails,
      errorMessage: 'Login failed after registration.',
    });

    return playerDetails;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Body() requestData: AuthenticationRequestDTO,
  ) {
    const dataAsDTO = plainToInstance(LoginDTO, requestData);
    const playerDetails = await this.authenticationService.login(dataAsDTO);

    this._handlePassportLogin({
      req,
      playerDetails: {
        playerID: playerDetails.playerID,
        playerObjectID: playerDetails.playerObjectID,
        username: playerDetails.username,
      },
      errorMessage: 'Login failed.',
    });

    // res.cookie(process.env.COOKIE_KEY as string, req.sessionID, {
    //   httpOnly: true,
    //   maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    //   sameSite: 'lax',
    //   secure: false,
    //   signed: true,
    // });

    return playerDetails;
  }

  @UseGuards(LocalAuthGuard)
  @Post('logout')
  async logout(@Req() req: Request) {
    // const playerID = req.user.playerID;
    // return this.authenticationService.logout(playerID);
    return req.logout();
  }

  _handlePassportLogin({
    req,
    playerDetails,
    errorMessage,
  }: {
    req: Request;
    playerDetails: PlayerDetails;
    errorMessage: string;
  }) {
    if (typeof req.login !== 'function') {
      console.warn(
        `[AuthController._handlePassportLogin] 'req.login' is not of type 'function'; type is '${typeof req.login}'`,
      );
      return;
    }

    req.login(playerDetails, (err) => {
      if (process.env.NODE_ENV !== 'test' && err != null) {
        console.warn('!'.repeat(process.stdout.columns));
        console.error(err);
        console.warn('!'.repeat(process.stdout.columns));
      }

      if (err) {
        console.error(err);
        throw new Error(`${errorMessage} [REASON] ${err.toString()}`);
      }
      // should this redirect somewhere?
    });
  }
}
