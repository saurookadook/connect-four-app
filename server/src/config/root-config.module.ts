import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { isTestEnv } from '@/utils/predicates';
import baseConfig from './base.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: isTestEnv(process.env.NODE_ENV) ? '.env.test' : '.env',
      isGlobal: true,
      load: [baseConfig],
    }),
  ],
})
export class RootConfigModule {}
