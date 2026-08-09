import { Global, Module } from '@nestjs/common';
import { DrizzleService } from './drizzle.service';

@Global()   // делает модуль доступным во всём приложении без импорта в каждый модуль
@Module({
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DbModule {}