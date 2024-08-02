import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LCCOM } from './lccom.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LCCOMService {
  constructor(
    @InjectRepository(LCCOM)
    private readonly lccomRepository: Repository<LCCOM>,
  ) {}


}