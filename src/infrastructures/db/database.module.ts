import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LinkEntity } from 'src/modules/links/entities/link.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'shortener',
      entities: [LinkEntity],
      synchronize: true, // только для dev!
    }),
    TypeOrmModule.forFeature([LinkEntity]), 
  ],
})
export class DatabaseModule {}
