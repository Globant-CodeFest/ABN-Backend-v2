import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RepositoryService } from './repository.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, RepositoryService],
})
export class AppModule {}
