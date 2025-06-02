import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import baseConfig from '@/config/base.config';
import { GameEngineModule } from '@game-engine/game-engine.module';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';

@Module({
  controllers: [AppController],
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
      isGlobal: true,
      load: [baseConfig],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log({
          name: 'AppModule.useFactory',
          database: configService.get('database.dbName'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
        });

        return {
          type: 'mongodb',
          database: configService.get('database.dbName'),
          host: configService.get('database.host'),
          port: configService.get('database.port'),
          entities: [__dirname + '/**/*.entity.ts'],
          autoLoadEntities: true,
          synchronize: true,
          logging: process.env.NODE_ENV !== 'production',
        };
      },
      inject: [ConfigService],
    }),
    GameEngineModule,
  ],
  providers: [AppService],
})
export class AppModule {}
