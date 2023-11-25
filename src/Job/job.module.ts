import { Controller, Module } from "@nestjs/common";
import { JobController } from "./job.controller";
import { JobService } from "./job.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Job } from "./job.entity";
import { MailModule } from "src/mail/mail.module";
import { UserService } from "src/User/user.service";
import { UserModule } from "src/User/user.module";

@Module({
    imports: [TypeOrmModule.forFeature([Job]), MailModule, UserModule],
    controllers: [JobController],
    providers: [JobService]
})
export class JobModule{}
