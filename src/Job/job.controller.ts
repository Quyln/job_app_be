import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JobService, } from './job.service';
import { createJDto } from './component/create_job_dto';
import { Job } from './job.entity';
import { updateJDto } from './component/update_job_dto';


@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService,
    ) {}


  @Get()
 async getNothing():Promise<Job[]> {
    return await this.jobService.getNothing();
  }
  @Get('alljobs')
 async getJob():Promise<Job[]> {
    return await this.jobService.getJob();
  }
  @Post('idjobsbyuser')
async getIdjobsByUser(@Body('user') userId:string):Promise<string>{
    return await this.jobService.getIdjobsByUser(userId);
  }
  @Get(':id')
async getJobsById(@Param() params: any):Promise<Job[]>{
  const id:string = params.id;
  return await this.jobService.getJobsById(id)
}

  @Post()
async  createPost(@Body() body:createJDto):Promise<Job>{
    console.log('một việc làm mới được gửi lên server với nội dung là ', body)
    return await this.jobService.createJob(body);
  }
  
  @Patch(':id')
 async update(@Param() params: any, @Body() body:updateJDto):Promise<boolean>{
  const id:string = params.id;
      return await this.jobService.updateJob(id,body);
  }

@Post('deleteJob')
async deleteJob(
  @Body() body: updateJDto): Promise<boolean>{
  return await this.jobService.deleteJob(body);
}
}
