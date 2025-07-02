import { Module } from '@nestjs/common';
import { IndexModule } from './modules';
import { DatabaseModule } from './infrastructures/db/database.module';
import { AppConfigModule } from './common/config/app-config.module';



@Module({
  imports: [
    IndexModule, 
    DatabaseModule,
    AppConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
