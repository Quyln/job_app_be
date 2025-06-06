import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { signInUserDto } from './component/signin.dto';
import { updateUserDto } from './component/update.user.dto';
import { User } from './user.entity';
import { forgotPasswordDto } from './component/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';
import { UserRouteClass } from './component/user_route_class';
import { ManageRouteIn } from './component/manage_route';
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
      phone: user.phone ?? '',
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

  // async createUser(body: createUserDto): Promise<User> {
  //    // Kiểm tra xem người dùng đã tồn tại không
  // const existingUser = await this.userRepository.findOne({ where: { id: body.id } });
  // if (existingUser) {
  //   throw new ConflictException(`Đã tồn tại ${body.id}, vui lòng chọn ID khác`);
  // }

  // // Kiểm tra xem email đã tồn tại không
  // const existingEmail = await this.userRepository.findOne({ where: { email: body.email } });
  // if (existingEmail) {
  //   throw new ConflictException(`Đã tồn tại ${body.email} vui lòng chọn Email khác`);
  // }
  //   const token:number = 100;
  //   const newUser: User = {
  //     id: body.id,
  //     email: body.email,
  //     password: body.password,
  //     fullname: body.fullname,
  //     position: body.position,
  //     companyname: body.companyname,
  //     companytax: body.companytax,
  //     lastjob: body.lastjob,
  //     savejobs: body.savejobs,
  //     appliedjobs: body.appliedjobs,
  //     postedjobs: body.postedjobs,
  //     avatar: body.avatar,
  //     phone: body.phone,
  //     token: token,
  //   };
  //   await this.userRepository.save(newUser);
  //   return newUser;
  // }


  async updateUser(id: string, body: updateUserDto): Promise<boolean> {
    const oldUserData = await this.userRepository.findOne({
      where: {
        id: id,
        password : body.password
      },
    });
    
    if (body.password != oldUserData.password || !oldUserData) {
      throw new Error('Sai thông tin tài khoản!');
       } else {
    //savejobs
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
     const newUserData = { ...oldUserData, ...body };
     await this.userRepository.save(newUserData);
     return true;
    }
    //update Latitude & Longitude
    if(body.longitude && body.latitude){
      oldUserData.longitude = body.longitude;
      oldUserData.latitude = body.latitude;
      await this.userRepository.save(oldUserData);
      return true;
    }
    // Update DailyRoute
    if(body.dailyroute){
      oldUserData.dailyroute =  body.dailyroute;
      await this.userRepository.save(oldUserData);
      return true;
    }
    // Update Token
    if(body.token){
      oldUserData.token += body.token;
      await this.userRepository.save(oldUserData);
      return true;
    }

    // Update lastCheckinTokenTime
    if(body.lastCheckinTokenTime){
      oldUserData.lastCheckinTokenTime = body.lastCheckinTokenTime;
      await this.userRepository.save(oldUserData);
      return true;
    }
    
    // Update Staff CheckStatus
    if(oldUserData.position == 'HR Manager'){
    const staffAccount =  await this.userRepository.findOne({
      where: {
        id: body.idstaff,
      }
      })
      staffAccount.checkstatus = body.staffcheckstatus;
      await this.userRepository.save(staffAccount);
      return true;
    }    
    //update avatar
    //  if(body.avatar){
    //   oldUserData.avatar = body.avatar;
    //   await this.userRepository.save(oldUserData);
    //   return true
    //  }
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


  async routeList(body: ManageRouteIn): Promise<UserRouteClass[]> {
    const checkUser:User = await this.userRepository.findOne({
      where: {
        id: body.id,
        password: body.password,
        position: 'HR Manager',
        companytag : body.companytag
      },
    });
    if (!checkUser) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }
    if (checkUser.password != body.password) {
      throw new BadRequestException('Sai mật khẩu');
    }
    if (checkUser.position != 'HR Manager') {
      throw new BadRequestException('Không có quyền truy cập');
    }
    const listUser:User[] = await this.userRepository.find(
     {where: {
      companytag : body.companytag,
      position : 'Staff'
     },select: ['id','fullname','dailyroute','checkstatus','position','phone','leader']
     }
    );
    const listUserRoute:UserRouteClass[] = listUser.map(user => ({id: user.id, fullname: user.fullname, dailyroute: user.dailyroute,checkstatus :user.checkstatus,position : user.position, phone : user.phone, leader : user.leader}));
    return listUserRoute;
  }

  async changePassword(body:updateUserDto):Promise<boolean>{
    const user: User = await this.userRepository.findOne({
      where: {
        id: body.id,
        password:body.password
      }
    });
    if(!user){
      throw new BadRequestException('Người dùng không tồn tại');
    } else {
      user.password = body.newpassword
      await this.userRepository.save(user);
      return true;
    }
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

    // hashed password 
    const hashedPassword1: string = this.hashPassword(newPassword);
    const hashedPassword2: string = this.hashPassword(`${hashedPassword1} qtech`);

    // update password for user into database
    const userWithNewPassword: User = { ...user, password: hashedPassword2 };
    await this.userRepository.save(userWithNewPassword);

    //send password to user through email
    const to: string[] = [user.email];
    const subject: string = 'Khôi phục mật khẩu mới cho tài khoản Q-TECH Solution HR Manager.';
    const text: string = `Xin chào ${user.fullname},\nBạn đã thành công thay đổi mật khẩu. Mật khẩu mới của bạn là: ${newPassword} `;

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

  private hashPassword(password: string): string {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
  }

  // async deleteUser(id: string): Promise<boolean> {
  //   const user = await this.userRepository.find({
  //     where: {
  //       id: id,
  //     },
  //   });
  //   if (user.length > 0) {
  //     await this.userRepository.remove(user);
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }


  // async sendEmailAppliedJob(body: SenderApplyJobDto):Promise<boolean>{
  //   const user = await this.userRepository.findOne({
  //     where: {
  //       id: body.creatorid,        
  //     }
  //   })
  //   const to: string[] = [user.email];
  //   const subject: string = 'Có ứng viên vừa ứng tuyển việc làm của bạn! - VnJob -';
  //   const text: string = `Xin chào ${user.companyname},\n\nCó 1 người dùng vừa ứng tuyển vị trí ${body.jobposition} mà ${user.companyname} đã đăng tuyển làm việc tại ${body.khuvuchuyen}, ${body.khuvuctinh}.\nThông tin ứng viên: \nHọ tên: ${body.sendername}\nSố điện thoại: ${body.senderphone}\nĐừng để ứng viên đợi lâu, hãy liên lạc cho họ ngay bạn nhé!`;

  //   const sendMailResult = await this.mailService.sendMail(to, subject, text);

  //   // return the send email result
  //   return sendMailResult.accepted.includes(user.email);
  // }


}
