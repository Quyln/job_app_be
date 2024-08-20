import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LCCOM } from "./lccom.entity";
import { MailModule } from "src/mail/mail.module";
import { LCCOMController } from "./lccom.controller";
import { LCCOMService } from "./lccom.service";
import { User } from "src/User/user.entity";
import { UserService } from "src/User/user.service";
import { UserModule } from "src/User/user.module";

@Module({
imports : [TypeOrmModule.forFeature([LCCOM, User]), MailModule, UserModule],
controllers: [LCCOMController],
providers: [LCCOMService,UserService],
exports: [LCCOMService,UserService]
})
export class LCCOMModule {}