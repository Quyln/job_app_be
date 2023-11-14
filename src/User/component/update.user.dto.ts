import { PartialType } from "@nestjs/mapped-types";
import { User } from "../user.entity";

export class updateUserDto extends PartialType(User) {
}