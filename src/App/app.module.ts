import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { JobModule } from 'src/Job/job.module';
import { UserModule } from 'src/User/user.module';
import { NewsModule } from 'src/News/news.module';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    JobModule,
    UserModule,
    NewsModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
