import { Body, Injectable, Post } from '@nestjs/common';
import { title } from 'process';
import { createJDto } from './component/create_job_dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from './job.entity';
import { In, Repository, getRepository } from 'typeorm';
import { updateJob } from './component/update_job_dto';
import { MailService } from 'src/mail/mail.service';
import { User } from 'src/User/user.entity';
import { SenderApplyJobDto } from './component/sender_applied_job_dto';


@Injectable()

export class JobService {
 
    constructor(
      @InjectRepository(Job)
        private readonly jobRepository: Repository<Job>,
        private readonly mailService: MailService,
        private readonly userRepository: Repository<User>
    ){}

    async getNothing():Promise<Job[]> {
      const emptyList:Job[] = [];
      return emptyList;
    }

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

  async sendEmailAppliedJob(body: SenderApplyJobDto):Promise<boolean>{
    const user = await this.userRepository.findOne({
      where: {
        id: body.creatorid,        
      }
    })
    const to: string[] = [user.email];
    const subject: string = 'Có ứng viên vừa ứng tuyển việc làm của bạn! - VnJob -';
    const text: string = `Xin chào ${user.companyname},\nTin vui! Có 1 người dùng vừa ứng tuyển vị trí ${body.jobposition} mà ${user.companyname} đã đăng tuyển làm việc tại ${body.khuvuchuyen}, ${body.khuvuctinh}.\nThông tin ứng viên: \nHọ tên: ${body.sendername}\nSố điện thoại: ${body.senderphone}\nĐừng để ứng viên đợi lâu, hãy liên lạc cho họ ngay bạn nhé!`;

    const sendMailResult = await this.mailService.sendMail(to, subject, text);

    // return the send email result
    return sendMailResult.accepted.includes(user.email);
  }
}
