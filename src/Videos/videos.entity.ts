import {  Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Videos {
  @PrimaryColumn('text', {array: true, default: []})
  videos: string[];
}
