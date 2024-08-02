import {  Body,  Controller,  Delete,  Get,  Param,  Patch,  Post} from '@nestjs/common';
import { LCCOMService } from './lccom.service';
import { LCCOM } from './lccom.entity';


@Controller('users')
export class LCCOMController {
  constructor(private readonly lccomService: LCCOMService) {}

}