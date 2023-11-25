import {  Injectable, Post } from '@nestjs/common';
import {  } from 'process';
import { createJDto } from './component/create_job_dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import {  Repository,  } from 'typeorm';
import { updateJob } from './component/update_job_dto';


@Injectable()

export class JobService {
 
    constructor(
      @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ){}

    async getNothing():Promise<Job[]> {
      const emptyList:Job[] = [];
      return emptyList;
    }

 async getJob():Promise<Job[]> {
    return await this.jobRepository.find();
  }
 async getIdjobsByUser(userId:string): Promise<string[]> {
    const jobsList:Job[] = await this.jobRepository.find({where:{
      user: userId
    }});
    const jobsById:string[] = jobsList.map((job:Job)=> {
      return job.id;
    })
    return  jobsById;
  }
  async getJobsById(id:string): Promise<Job[]> {
    const listIds:string[] = id.split(',').map((item)=>item.trim());
    const jobList: Job[] = await this.jobRepository.find();
    const filteredList: Job[] = jobList.filter(job => listIds.includes(job.id));
    return filteredList;
  }

 async createJob(body: createJDto):Promise<Job>{
    const id:string = new Date().getTime().toString();
    // get date
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const date:string = day.toString().padStart(2,'0') + '-' + month.toString().padStart(2,'0') + '-' + year;
    // covert string to string[]
    const listMotacv:string[] = body.motacv.split('.').map((item)=>item.trim());
    const listYeucaucv:string[] = body.yeucaucv.split('.').map((item)=> item.trim());
    //covert string to number
    const latitude = parseFloat(body.latitude);
    const longitude = parseFloat(body.longitude);


    const newPost:Job = {
      id: id,
      title: body.title,
      user: body.user,
      date: date,
      position: body.position,
      salary: body.salary,
      khuvuchuyen: body.khuvuchuyen,
      khuvuctinh: body.khuvuctinh,
      latitude: latitude,
      longitude: longitude,
      tencty: body.tencty,
      logocty: body.logocty,
      image: body.image,
      yeucaucv: listYeucaucv,
      motacv: listMotacv,
    }
   await  this.jobRepository.save(newPost);
     return newPost;
  }
 async updateJob(id: string, body:updateJob):Promise<Job>{
    const oldData = await this.jobRepository.findOne({
      where: {
        id:id
      }
    })
    const newData = {...oldData, ...body}
    return await this.jobRepository.save(newData);
  }
  
 async deleteJob(id:string):Promise<boolean>{
    const currentData = await this.jobRepository.find({
      where: {
        id:id
      }
    })
    if (currentData.length >0){
      await this.jobRepository.remove(currentData)
    return true;
    } else {
      return false;
    }    
  }

  
}
