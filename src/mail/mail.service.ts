import { Injectable } from '@nestjs/common';
import * as nodeMailer from 'nodemailer';

@Injectable()
export class MailService {
  constructor() {}

  async sendMail(to: string[], subject: string, text: string): Promise<any> {
    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'lunhatquy1111@gmail.com',
        pass: 'iwni qwjw otck pxoe',
      },
    });

    const info = await transporter.sendMail({
      from: '"VnJob" <lunhatquy1111@gmail.com>', // sender address
      to: to, // list of receivers
      subject: subject, // Subject line
      text: text, // plain text body
    });

    return info;
  }
}
