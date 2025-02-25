import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { UserModule } from 'src/User/user.module';
import { NewsModule } from 'src/News/news.module';
import { MailModule } from 'src/mail/mail.module';
import * as bodyParser from 'body-parser';
import { LCCOMModule } from 'src/LCCOM/lccom.module';
import { JobModule } from 'src/Job/job.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    UserModule,
    NewsModule,
    LCCOMModule,
    MailModule,
    JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(bodyParser.json({ limit: '10mb' }))
    .forRoutes('*');
  consumer
    .apply(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
    .forRoutes('*');
  }
}
