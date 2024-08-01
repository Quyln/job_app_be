import { Injectable } from '@nestjs/common';
export class JobClass {
  id:number;
  user:string;
  title:string;
  position:string;
  motacv:string[];
  yeucaucv:string[];
  salary:string;
  khuvuctinh:string;
  khuvuchuyen:string;
  tencty:string;
  logocty:string;
  date:string;
  image:string;
}
export class createPDto{
  user:string;
  title:string;
  position:string;
  motacv:string;
  yeucaucv:string;
  salary:string;
  khuvuctinh:string;
  khuvuchuyen:string;
  tencty:string;
  logocty:string;
  date:string;
  image:string;
}
@Injectable()

export class AppService {


    getHello(): string {
      return 'Hello World!';
    }
  
}
