import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { JobService, } from './job.service';
import { createJDto } from './component/create_job_dto';
import { Job } from './job.entity';
import { updateJob } from './component/update_job_dto';


@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get()
 async getPosts():Promise<Job[]> {
    return await this.jobService.getJob();
  }
  @Get('user')
async  getPostUser():Promise<string[]>{
    return await this.jobService.getJobUser();
  }
  @Get('jobsbyid')
async getJobsById(@Body() ids: string):Promise<Job[]>{
  return await this.jobService.getListJobByID(ids);
}

  @Post()
async  createPost(@Body() body:createJDto):Promise<Job>{
    console.log('một việc làm mới được gửi lên server với nội dung là ', body)
    return await this.jobService.createJob(body);
  }
  @Patch(':id')
 async update(@Param() params: any, @Body() body:updateJob):Promise<Job>{
  const id:string = params.id;
      return await this.jobService.updateJob(id,body);
  }

  @Delete(':id')
 async deleteJob(@Param() params: any){
    const id:string = params.id
    return await this.jobService.deleteJob(id);
  }
}
