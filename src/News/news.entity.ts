import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class News {
  @PrimaryColumn()
  link: string;
  @Column()
  image: string;
  @Column()
  title: string;
  @Column()
  author: string;
}
