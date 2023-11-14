import { Body, Controller, Get, Post } from '@nestjs/common';
import { NewsService } from './news.service';
import { News } from './news.entity';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}
  @Get()
  async getNews(): Promise<News[]> {
    return await this.newsService.getNews();
  }
  @Post()
  async createNews(@Body() body: News): Promise<News> {
    return await this.newsService.createNews(body);
  }
}
