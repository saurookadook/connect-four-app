import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import baseConfig, { buildConnectionURI } from '@/config';

export const databaseProviders = [
  ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    isGlobal: true,
    load: [baseConfig],
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      uri: buildConnectionURI(configService),
    }),
    inject: [ConfigService],
  }), // force formatting
];
