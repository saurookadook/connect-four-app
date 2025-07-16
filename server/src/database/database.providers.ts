import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

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
      onConnectionCreate: (connection: Connection) => {
        connection.on('open', () => {
          // TODO: better way to make sure this collection is created
          // with a clusteredIndex?
          void connection
            .createCollection('board_states', {
              clusteredIndex: {
                key: { _id: 1 },
                unique: true,
                name: 'board_states clustered key',
              },
              expireAfterSeconds: 60 * 60 * 2, // 2 hours
            })
            .catch((reason) => {
              console.error(reason);
            });
        });

        return connection;
      },
    }),
    inject: [ConfigService],
  }),
];
