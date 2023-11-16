import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  id: string;
  @Column()
  password: string;
  @Column()
  fullname: string;
  @Column()
  email?: string;
  @Column()
  position: string;
  @Column()
  lastjob: string;
  @Column()
  avatar: string;
  @Column()
  phone: string;
  @Column()
  token: number;
  @Column()
  companyname?: string;
  @Column()
  companytax?: string;
}
