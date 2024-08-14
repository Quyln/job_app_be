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

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}


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
    //Change Password
    if(body.password && body.newpassword){
      if (!oldUserData) {
        throw new Error('Người dùng không tồn tại');
      }
    if (body.password != oldUserData.password) {
    throw new Error('Mật khẩu hiện tại không đúng');
     } else {
      oldUserData.password = body.newpassword;
      await this.userRepository.save(oldUserData);
      return true;
     }
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
     },select: ['id','fullname','dailyroute','checkstatus','position']
     }
    );
    const listUserRoute:UserRouteClass[] = listUser.map(user => ({id: user.id, fullname: user.fullname, dailyroute: user.dailyroute,checkstatus :user.checkstatus,position : user.position}));
    return listUserRoute;
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

}
