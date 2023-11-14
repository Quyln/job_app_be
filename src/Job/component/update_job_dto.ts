import { PartialType } from "@nestjs/mapped-types";
import { Job } from "../job.entity";

export class updateJob extends PartialType(Job){

}