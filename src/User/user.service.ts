import { BadRequestException, Body, Injectable } from '@nestjs/common';
import { title } from 'process';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { updateUserDto } from './component/update.user.dto';
import { signInUserDto } from './component/signin.dto';



@Injectable()

export class UserService {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}
   async getUser():Promise <User[]>{
        return await this.userRepository.find();
    }

   async createUser(body:User):Promise<User>{
    const newUser:User =  {
        id: body.id,
        password: body.password,
        fullname: body.fullname,
        position: body.position,
        companyname: body.companyname,
        companytax: body.companytax,
        lastjob: body.lastjob,
        avatar: body.avatar,
        phone: body.phone,
        token: body.token,
    }
    await this.userRepository.save(newUser);
    return newUser;
}

async updateUser(id:string ,body:updateUserDto):Promise<User>{
    const oldUserData = await this.userRepository.findOne({
        where: {
            id:id,
        }
    })
    const newUserData = {...oldUserData,...body};
    return await this.userRepository.save(newUserData);
}

    async deleteUser(id:string):Promise<boolean>{
        const user = await this.userRepository.find({
            where: {
                id:id,
            }
        })
        if(user.length > 0){
            await this.userRepository.remove(user)
            return true;
        } else {
            return false;
        }
    }

    async signIn(body: signInUserDto):Promise<User>{
        const userSignIn = await this.userRepository.findOne({
            where: {
                id: body.id,
            }
        })
        if (!userSignIn){
            throw new BadRequestException('Tài khoản không tồn tại')
        }
        if (userSignIn.password != body.password){
            throw new BadRequestException('Sai mật khẩu');
        }
        return userSignIn;
    }
}
