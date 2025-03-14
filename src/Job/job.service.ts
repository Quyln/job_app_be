import {  Injectable, Post } from '@nestjs/common';
import {  } from 'process';
import { createJDto } from './component/create_job_dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import {  Repository,  } from 'typeorm';
import { updateJDto } from './component/update_job_dto';
import { User } from 'src/User/user.entity';


@Injectable()

export class JobService {
 
    constructor(
      @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
      @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async getNothing():Promise<Job[]> {
      const emptyList:Job[] = [];
      return emptyList;
    }

 async getJob():Promise<Job[]> {
    return await this.jobRepository.find();
  }
 async getIdjobsByUser(userId:string): Promise<string> {
    const jobsList:Job[] = await this.jobRepository.find();
    const filteredList:Job[] = jobsList.filter(job => job.user === userId);
    const IdjobsList:string[] = filteredList.map((job:Job)=> {
      return job.id;
    });
    const Idjobs:string = IdjobsList.join(',');
    const user:User = await this.userRepository.findOne({where:{id: userId}});
    user.postedjobs = Idjobs;

    return  user.postedjobs;
  }
  async getJobsById(id:string): Promise<Job[]> {
    const listIds:string[] = id.split(',').map((item)=>item.trim());
    const jobList: Job[] = await this.jobRepository.find();
    const filteredList: Job[] = jobList.filter(job => listIds.includes(job.id));
    return filteredList;
  }

 async createJob(body: createJDto):Promise<Job>{
  const oldUserData = await this.userRepository.findOne({
    where: {
      id: body.userid,
      password : body.password
    },
  });
  
  if (body.password != oldUserData.password || !oldUserData) {
    throw new Error('Sai thông tin tài khoản!');
     } else {
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
      user: body.userid,
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
    
  }
 async updateJob(id: string, body:updateJDto):Promise<boolean>{
  const oldUserData = await this.userRepository.findOne({
    where: {
      id: body.userid,
      password : body.password
    },
  });
  
  if (body.password != oldUserData.password || !oldUserData) {
    throw new Error('Sai thông tin tài khoản!');
     } else {
      const oldJobData = await this.jobRepository.findOne({
        where: {
          id:id
        }
      })
      if(id != oldJobData.id || !oldJobData){
        throw new Error ('Không có việc này')
      } else {

        if (body.image) oldJobData.image = body.image;
        if (body.khuvuchuyen) oldJobData.khuvuchuyen = body.khuvuchuyen;
        if (body.khuvuctinh) oldJobData.khuvuctinh = body.khuvuctinh;
        if (body.latitude) {
          const latitude = parseFloat(body.latitude);
          oldJobData.latitude = latitude;}       
        if (body.longitude){
          const longitude = parseFloat(body.longitude);
          oldJobData.longitude = longitude;
        } 
        if (body.motacv){
          const listMotacv:string[] = body.motacv.split('.').map((item)=>item.trim());
          oldJobData.motacv = listMotacv;
        } 
        if (body.position) oldJobData.position = body.position;
        if (body.salary) oldJobData.salary = body.salary;
        if (body.tencty) oldJobData.tencty = body.tencty;
        if (body.title) oldJobData.title = body.title;
        if (body.yeucaucv){
          const listYeucaucv:string[] = body.yeucaucv.split('.').map((item)=> item.trim());
          oldJobData.yeucaucv = listYeucaucv;
        } 
      
        await this.jobRepository.save(oldJobData);
      
        return true;
      }
     }
   
  }
  
 async deleteJob(body:updateJDto):Promise<boolean>{
  const oldUserData = await this.userRepository.findOne({
    where: {
      id: body.userid,
      password : body.password
    },
  });
  
  if (body.password != oldUserData.password || !oldUserData) {
    throw new Error('Sai thông tin tài khoản!');
     } else {
      const currentData = await this.jobRepository.findOne({
        where: {
          id: body.jobid
        }
      })
      await this.jobRepository.remove(currentData)
return true
     }
    
  }

  
}
