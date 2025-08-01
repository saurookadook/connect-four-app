import { inspect } from 'node:util';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { type Request, type Response } from 'express';

import { sharedLog, type PlayerID } from '@connect-four-app/shared';
import { PlayerDetails } from '@/types/main';
import {
  AuthenticationRequestDTO,
  RegisterDTO,
  LoginDTO,
} from './dtos/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AuthenticationService } from './authentication.service';

const logger = sharedLog.getLogger('AuthController');

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

  @Delete('logout/:playerID')
  async logout(
    // TODO: maybe don't need to pass this? or could use it to delete the other session record?
    @Param('playerID') playerID: PlayerID, // force formatting
    @Req() req: Request,
    @Res() res: Response,
  ) {
    logger.debug(
      '[logout method] args',
      inspect(
        {
          playerID,
          req,
          res,
        },
        {
          colors: true,
          compact: false,
          depth: 1,
          showHidden: true,
          sorted: true,
        },
      ),
    );

    return this._handlePassportLogout(req, res);
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
      logger.warn(
        `[AuthController._handlePassportLogin] 'req.login' is not of type 'function'; type is '${typeof req.login}'`,
      );
      return;
    }

    req.login(playerDetails, (err) => {
      if (process.env.NODE_ENV !== 'test' && err != null) {
        logger.warn('!'.repeat(process.stdout.columns));
        logger.error(err);
        logger.warn('!'.repeat(process.stdout.columns));
      }

      if (err) {
        logger.error(err);
        throw new Error(`${errorMessage} [REASON] ${err.toString()}`);
      }
      // should this redirect somewhere?
    });
  }

  _handlePassportLogout(req: Request, res: Response) {
    return req.logout(function (err) {
      if (err) {
        logger.error('Logout failed:\n', err);
        throw new Error(`Logout failed: ${err.message}`, { cause: err });
      }

      req.session.destroy(function (err) {
        if (err) {
          logger.error('Failed to destroy session:\n', err);
        }
      });

      res.clearCookie('connect.sid', { path: '/' });
      return res.status(200).send({ message: 'Logut successful', status: 200 });
    });
  }
}
