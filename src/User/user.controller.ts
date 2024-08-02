import {  Body,  Controller,  Delete,  Get,  Param,  Patch,  Post} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { updateUserDto } from './component/update.user.dto';
import { signInUserDto } from './component/signin.dto';
import { forgotPasswordDto } from './component/forgot-password.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}




  @Patch(':id')
  async updateUser(
    @Param() params: any,
    @Body() body: updateUserDto,
  ): Promise<boolean> {
    const id: string = params.id;
    return await this.userService.updateUser(id, body);
  }


  @Post('signin')
  async signin(@Body() body: signInUserDto): Promise<User> {
    return await this.userService.signIn(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: forgotPasswordDto): Promise<boolean> {
    return await this.userService.forgotPassword(body);
  }


}
