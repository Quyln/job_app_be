import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { updateUserDto } from './component/update.user.dto';
import { signInUserDto } from './component/signin.dto';
import { forgotPasswordDto } from './component/forgot-password.dto';
import { createUserDto } from './component/create.user.dto';
import { SenderApplyJobDto } from 'src/User/component/appliedjob.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('useridlist')
  async getListIdUser():Promise<User[]>{
    return await this.userService.getListIdUser();
  }

  @Post()
  async createUser(@Body() body: createUserDto): Promise<User> {
    return await this.userService.createUser(body);
  }
  @Patch(':id')
  async updateUser(
    @Param() params: any,
    @Body() body: updateUserDto,
  ): Promise<User> {
    const id: string = params.id;
    return await this.userService.updateUser(id, body);
  }

  @Delete(':id')
  async deleteUser(@Param() params: any) {
    const id: string = params.id;
    return await this.userService.deleteUser(id);
  }

  @Post('signin')
  async signin(@Body() body: signInUserDto): Promise<User> {
    return await this.userService.signIn(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: forgotPasswordDto): Promise<boolean> {
    return await this.userService.forgotPassword(body);
  }

  @Post('appliedjob')
 async sendEmailAppliedJob(@Body() body: SenderApplyJobDto):Promise<boolean>{
    return await this.userService.sendEmailAppliedJob(body);
  }
}
