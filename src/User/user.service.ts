import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { signInUserDto } from './component/signin.dto';
import { updateUserDto } from './component/update.user.dto';
import { User } from './user.entity';
import { forgotPasswordDto } from './component/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';
import { createUserDto } from './component/create.user.dto';
import { SenderApplyJobDto } from 'src/User/component/appliedjob.dto';
import { filterUserDto } from './component/filter.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}

  async getListIdUser():Promise<filterUserDto[]>{
    const listIdUser:User[] = await this.userRepository.find();
    const filterdList:filterUserDto[] = listIdUser.map(user => ({
      id: user.id,
      avatar: user.avatar,
      fullname: user.fullname ?? '',
      companyname: user.companyname ?? '',
      longitude: user.longitude ?? '',
      latitude: user.latitude ?? '',
    }));
    
    return filterdList;
  }

  async getOneUserInfo(userid:string):Promise<filterUserDto>{
    const user:User = await this.userRepository.findOne({where: {
      id: userid,
    },
    select: ['id','avatar','fullname','companyname','phone']
  });
   const filteredUser: filterUserDto =new filterUserDto()
  filteredUser.id = user.id;
  filteredUser.avatar = user.avatar;
  filteredUser.fullname = user.fullname;
  filteredUser.companyname = user.companyname;

    return filteredUser;
  }

  async createUser(body: createUserDto): Promise<User> {
    const token:number = 100;
    const newUser: User = {
      id: body.id,
      email: body.email,
      password: body.password,
      fullname: body.fullname,
      position: body.position,
      companyname: body.companyname,
      companytax: body.companytax,
      lastjob: body.lastjob,
      savejobs: body.savejobs,
      appliedjobs: body.appliedjobs,
      postedjobs: body.postedjobs,
      avatar: body.avatar,
      phone: body.phone,
      token: token,
    };
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: string, body: updateUserDto): Promise<User> {
    const oldUserData = await this.userRepository.findOne({
      where: {
        id: id,
      },
    });
    if (body.savejobs) {
      const savejobsArray = oldUserData.savejobs.split(','); 
      if(savejobsArray.includes(body.savejobs)){
       const removeSavejob = savejobsArray.filter((item)=> item !== body.savejobs);
       oldUserData.savejobs = removeSavejob.join(',');
       body.savejobs = oldUserData.savejobs;
      } else{
        if(oldUserData.savejobs){
          body.savejobs = oldUserData.savejobs + ',' + body.savejobs;
          const newSavejobsArray = body.savejobs.split(',');
          const mergedSavejobsArray = [...savejobsArray, ...newSavejobsArray];
          const uniqueSavejobsArray = [...new Set(mergedSavejobsArray)];
          const updatedSavejobs = uniqueSavejobsArray.join(',');
          body.savejobs = updatedSavejobs;
        } else {
          oldUserData.savejobs = body.savejobs;
        }
      }          
    }
    if(body.appliedjobs){
      if(oldUserData.appliedjobs){
        body.appliedjobs = oldUserData.appliedjobs + ',' + body.appliedjobs;
        const newAppliedjobsArray = body.appliedjobs.split(',');
        const appliedjobsArray = oldUserData.appliedjobs.split(',')
        const mergedAppliedjobsArray = [...appliedjobsArray, ...newAppliedjobsArray];
        const uniqueAppliedjobsArray = [...new Set(mergedAppliedjobsArray)];
        const updatedAppliedjobs = uniqueAppliedjobsArray.join(',');
        body.appliedjobs = updatedAppliedjobs;
      } else {
        oldUserData.appliedjobs = body.appliedjobs;
      }
    }
    
    const newUserData = { ...oldUserData, ...body };
    return await this.userRepository.save(newUserData);
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.userRepository.find({
      where: {
        id: id,
      },
    });
    if (user.length > 0) {
      await this.userRepository.remove(user);
      return true;
    } else {
      return false;
    }
  }

  async signIn(body: signInUserDto): Promise<User> {
    const userSignIn = await this.userRepository.findOne({
      where: {
        id: body.id,
      },
    });
    if (!userSignIn) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (userSignIn.password != body.password) {
      throw new BadRequestException('Sai mật khẩu');
    }
    return userSignIn;
  }

  async forgotPassword(body: forgotPasswordDto): Promise<boolean> {
    const user: User = await this.userRepository.findOne({
      where: {
        id: body.id,
        email: body.email,
      },
    });

    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    // generate new password for user
    const newPassword: string = this.generatePassword();

    // update password for user into database
    const userWithNewPassword: User = { ...user, password: newPassword };
    await this.userRepository.save(userWithNewPassword);

    //send password to user through email
    const to: string[] = [user.email];
    const subject: string = 'Khôi phục mật khẩu mới cho tài khoản Job App';
    const text: string = `Xin chào ${user.fullname}${user.companyname},\nBạn đã thành công thay đổi mật khẩu của tài khoản JobApp. Mật khẩu mới của bạn là: ${newPassword} `;

    const sendMailResult = await this.mailService.sendMail(to, subject, text);

    // return the send email result
    return sendMailResult.accepted.includes(user.email);
  }

  generatePassword(): string {
    const characters =
      'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 6; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  async sendEmailAppliedJob(body: SenderApplyJobDto):Promise<boolean>{
    const user = await this.userRepository.findOne({
      where: {
        id: body.creatorid,        
      }
    })
    const to: string[] = [user.email];
    const subject: string = 'Có ứng viên vừa ứng tuyển việc làm của bạn! - VnJob -';
    const text: string = `Xin chào ${user.companyname},\n\nCó 1 người dùng vừa ứng tuyển vị trí ${body.jobposition} mà ${user.companyname} đã đăng tuyển làm việc tại ${body.khuvuchuyen}, ${body.khuvuctinh}.\nThông tin ứng viên: \nHọ tên: ${body.sendername}\nSố điện thoại: ${body.senderphone}\nĐừng để ứng viên đợi lâu, hãy liên lạc cho họ ngay bạn nhé!`;

    const sendMailResult = await this.mailService.sendMail(to, subject, text);

    // return the send email result
    return sendMailResult.accepted.includes(user.email);
  }
}
