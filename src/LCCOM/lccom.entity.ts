import { Column, Entity,PrimaryColumn } from "typeorm";

@Entity()
export class LCCOM {
    @PrimaryColumn()
    companytag: String;
    @Column()
    companyname: string;
    @Column()
    branchname?: string;
    @Column()
    longitude?: string;
    @Column()
    latitude?: string;
    @Column()
    phone?: string;
    @Column()
    anddress?: string;
}