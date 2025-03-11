import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Videos } from './videos.entity';

@Injectable()
export class VideosService {
  constructor(
    @InjectRepository(Videos)
    private readonly VideosRepository: Repository<Videos>,
  ) {}

  async getVideos(): Promise<Videos[]> {
    const videos = await this.VideosRepository.find();
    return videos;
  }

  
}
