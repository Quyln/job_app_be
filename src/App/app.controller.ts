import {  Controller, Get, Post } from '@nestjs/common';
import { AppService,} from './app.service';

interface User {name:String, old:number, children?:[]}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('version')
  getVersion(): string {
    return '1.3.1';
  }

}
