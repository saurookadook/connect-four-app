import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as mongoose from 'mongoose';

import baseConfig from '@/config/base.config';
import { MONGO_DB_CONNECTION } from '@/constants/db';

export const BaseDatabaseProvider = [
  ConfigModule.forRoot({
    envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
    isGlobal: true,
    load: [baseConfig],
  }),
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => {
      // console.log({
      //   name: 'GameSessionService.useFactory',
      //   database: configService.get('database.dbName'),
      //   host: configService.get('database.host'),
      //   port: configService.get('database.port'),
      // });

      return {
        type: 'mongodb',
        database: configService.get('database.dbName'),
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        autoLoadEntities: true,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
      };
    },
    inject: [ConfigService],
  }),
];

// TODO: maybe don't need this?
export const databaseProvider = {
  provide: MONGO_DB_CONNECTION,
  useFactory: async (configService: ConfigService) => {
    const connectionURL = `mongodb://${configService.get('database.host')}:${configService.get('database.port')}/${configService.get('database.dbName')}`;
    const connection = await mongoose.connect(connectionURL);
    return connection;
  },
  inject: [ConfigService],
};
