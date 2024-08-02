import {  Body,  Controller,  Delete,  Get,  Param,  Patch,  Post} from '@nestjs/common';
import { LCCOMService } from './lccom.service';
import { LCCOM } from './lccom.entity';


@Controller('LCCOM')
export class LCCOMController {
  constructor(private readonly lccomService: LCCOMService) {}

@Get()
async getLocations(): Promise<LCCOM[]>{
    return await this.lccomService.getLocations();
}

}