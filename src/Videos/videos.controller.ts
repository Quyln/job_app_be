import { Body, Controller, Get, Post } from '@nestjs/common';
import { VideosService } from './videos.service';
import { Videos } from './videos.entity';

@Controller('videos')
export class VideosController {
  constructor(private readonly VideosService: VideosService) {}
  @Get()
  async getVideos(): Promise<Videos[]> {
    return await this.VideosService.getVideos();
  }
 
}
