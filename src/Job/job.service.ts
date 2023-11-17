import { Body, Injectable, Post } from '@nestjs/common';
import { title } from 'process';
import { createPDto } from './component/create_job_dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { Repository } from 'typeorm';
import { updateJob } from './component/update_job_dto';


@Injectable()

export class JobService {
 
    constructor(
      @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
    ){}
 async getJob():Promise<Job[]> {
    return await this.jobRepository.find();
  }
 async getJobUser(): Promise<string[]> {
    const userData:Job[] = await this.jobRepository.find();
    const users:string[] = userData.map((post:Job)=> {
      return post.user;
    })
    return  users;
  }
 async createJob(body: createPDto):Promise<Job>{
    const id:string = new Date().getTime().toString();
    // get date
    const day = new Date().getDate();
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    const date:string = day.toString().padStart(2,'0') + '-' + month.toString().padStart(2,'0') + '-' + year;
    // covert string to string[]
    const listMotacv:string[] = body.motacv.split(',').map((item)=>item.trim());
    const listYeucaucv:string[] = body.yeucaucv.split(',').map((item)=> item.trim());

    const newPost:Job = {
      id: id,
      title: body.title,
      user: body.user,
      date: date,
      position: body.position,
      salary: body.salary,
      khuvuchuyen: body.khuvuchuyen,
      khuvuctinh: body.khuvuctinh,
      latitude: body.latitude,
      longitude: body.longitude,
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
