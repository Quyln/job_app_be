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
  email: string;
  @Column()
  position: string;
  @Column()
  avatar: string;
  @Column()
  phone: string;
  @Column()
  longitude?: string;
  @Column()
  latitude?: string;
  @Column()
  token: number;
  @Column()
  lastCheckinTokenTime: string;
  @Column()
  companyname: string;
  @Column()
  companytag: string;
  @Column()
  ggsheet: string;
  @Column()
  ggsheetjob: string;
  @Column()
  leader: string;
  @Column()
  postedjobs?: string;
  @Column()
  dailyroute?: string;
  @Column()
  checkstatus?: string;
  @Column()
  savejobs?: string;
  @Column()
  starthour1?: number;
  @Column()
  startminute1?: number;
  @Column()
  starthour2?: number;
  @Column()
  startminute2?: number;
  @Column()
  endhour1?: number;
  @Column()
  endminute1?: number;
  @Column()
  endhour2?: number;
  @Column()
  endminute2?: number;
}
