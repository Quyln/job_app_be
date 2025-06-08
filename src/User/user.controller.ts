import {  Body,  Controller,  Delete,  Get,  Param,  Patch,  Post} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { updateUserDto } from './component/update.user.dto';
import { signInUserDto } from './component/signin.dto';
import { forgotPasswordDto } from './component/forgot-password.dto';
import { ManageRouteIn } from './component/manage_route';
import { UserRouteClass } from './component/user_route_class';
import { filterUserDto } from './component/filter.user.dto';
import { requestPushTokenUser } from './component/request.pushtoken';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Get('useridlist')
  async getListIdUser():Promise<filterUserDto[]>{
    return await this.userService.getListIdUser();
  }

    @Post('takeoneuser')
  async getOneUserInfo(@Body('userid') userid: string):Promise<filterUserDto>{
    return await this.userService.getOneUserInfo(userid);
  }

   @Post('getpushtoken')
  async getpushtoken(@Body() body: requestPushTokenUser):Promise<string>{
    return await this.userService.getPushToken(body);
  }


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
  
  @Post('routeList')
  async routeList(@Body() body: ManageRouteIn): Promise<UserRouteClass[]> {
    return await this.userService.routeList(body);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() body: forgotPasswordDto): Promise<boolean> {
    return await this.userService.forgotPassword(body);
  }

  @Post('change-password')
  async changePassword(@Body() body: updateUserDto): Promise<boolean> {
    return await this.userService.changePassword(body);
  }

  //   @Post()
  // async createUser(@Body() body: createUserDto): Promise<User> {
  //   return await this.userService.createUser(body);
  // }


//     @Post('appliedjob')
//  async sendEmailAppliedJob(@Body() body: SenderApplyJobDto):Promise<boolean>{
//     return await this.userService.sendEmailAppliedJob(body);
//   }

}
