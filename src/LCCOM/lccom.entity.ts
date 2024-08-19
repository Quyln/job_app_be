import { Column, Entity,PrimaryColumn } from "typeorm";

@Entity()
export class LCCOM {
    @PrimaryColumn()
    id: string;
    @Column()
    companyname: string;
    @Column()
    branchname?: string;
    @Column()
    companytag: string;
    @Column()
    longitude?: string;
    @Column()
    latitude?: string;
    @Column()
    phone?: string;
    @Column()
    address?: string;
}