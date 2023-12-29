import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from 'db/data-source';
import { JobModule } from 'src/Job/job.module';
import { UserModule } from 'src/User/user.module';
import { NewsModule } from 'src/News/news.module';
import { MailModule } from 'src/mail/mail.module';
import { json } from 'body-parser';

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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(json({ limit: '3mb' })) // Thay đổi giới hạn kích thước thành 10MB (hoặc giới hạn mong muốn)
      .forRoutes('*');
  }
}
