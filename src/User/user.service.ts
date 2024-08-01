import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { signInUserDto } from './component/signin.dto';
import { updateUserDto } from './component/update.user.dto';
import { User } from './user.entity';
import { forgotPasswordDto } from './component/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';

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
      },
    });
    
    //update Latitude & Longitude
    if(body.longitude && body.latitude){
      oldUserData.longitude = body.longitude;
      oldUserData.latitude = body.latitude;
      await this.userRepository.save(oldUserData);
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
     }}
    //update avatar
    //  if(body.avatar){
    //   oldUserData.avatar = body.avatar;
    //   await this.userRepository.save(oldUserData);
    //   return true
    //  }
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


}
