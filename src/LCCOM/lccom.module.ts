import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LCCOM } from "./lccom.entity";
import { MailModule } from "src/mail/mail.module";
import { LCCOMController } from "./lccom.controller";
import { LCCOMService } from "./lccom.service";
import { User } from "src/User/user.entity";

@Module({
imports : [TypeOrmModule.forFeature([LCCOM, User]), MailModule],
controllers: [LCCOMController],
providers: [LCCOMService],
exports: [LCCOMService]
})
export class LCCOMModule {}