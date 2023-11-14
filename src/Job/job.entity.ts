import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Job {
    @PrimaryColumn()
    id:string;
    @Column()
    user:string;
    @Column()
    title:string;
    @Column()
    position:string;
    @Column('text', { array: true, default: []})
    motacv:string[];
    @Column('text', {array:true, default: []})
    yeucaucv:string[];
    @Column()
    salary:string;
    @Column()
    khuvuctinh:string;
    @Column()
    khuvuchuyen:string;
    @Column()
    tencty:string;
    @Column()
    logocty:string;
    @Column()
    date:string;
    @Column()
    image:string;
  }