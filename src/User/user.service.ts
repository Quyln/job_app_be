import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { signInUserDto } from './component/signin.dto';
import { updateUserDto } from './component/update.user.dto';
import { User } from './user.entity';
import { forgotPasswordDto } from './component/forgot-password.dto';
import { MailService } from 'src/mail/mail.service';
import { createUserDto } from './component/create.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService,
  ) {}
  async getUser(): Promise<User[]> {
    return await this.userRepository.find();
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
}
