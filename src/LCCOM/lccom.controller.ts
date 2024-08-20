import {  Body,  Controller,  Delete,  Get,  Param,  Patch,  Post, Req} from '@nestjs/common';
import { LCCOMService } from './lccom.service';
import { LCCOM } from './lccom.entity';
import { updateComClass } from './component/update.com.dto';
import { createLocationClass } from './component/create.com.dto';


@Controller('LCCOM')
export class LCCOMController {
  constructor(private readonly lccomService: LCCOMService) {}

@Get()
async getLocations(): Promise<LCCOM[]>{
    return await this.lccomService.getLocations();
}
@Post()
async createLocation(@Body() body: createLocationClass): Promise<boolean> {
  return await this.lccomService.createLocation(body);
}

@Patch(':id')
async configureLocation(
  @Param() params: any,
  @Body() body: updateComClass,
): Promise<boolean> {
  const id: string = params.id;
  return await this.lccomService.configureLocation(id, body);
}

@Post('deleteLocation')
async deleteLocation(
  @Body() body: updateComClass): Promise<boolean>{
  return await this.lccomService.deleteLocation(body);
}

}