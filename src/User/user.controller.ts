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

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(): Promise<User[]> {
    return await this.userService.getUser();
  }
  @Post()
  async createUser(@Body() body: User): Promise<User> {
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
}
