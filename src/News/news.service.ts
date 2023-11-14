import { Body, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { NewsController } from "./news.controller";
import { InjectRepository } from "@nestjs/typeorm";
import { News } from "./news.entity";
import { title } from "process";

@Injectable()
export class NewsService{
    constructor(
        @InjectRepository(News)
        private readonly newsRepository:Repository<News>,
    ){}

  async  getNews():Promise<News[]>{
    const news = await this.newsRepository.find()
    return news;
  }

  async createNews (body:News):Promise<News>{
    const newNews:News =  {
        link: body.link,
        image: body.image,
        author: body.author,
        title: body.title,
    }
    return await this.newsRepository.save(newNews);
  }
}