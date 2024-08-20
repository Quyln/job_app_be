import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LCCOM } from './lccom.entity';
import { Repository } from 'typeorm';
import { updateComClass } from './component/update.com.dto';
import { User } from 'src/User/user.entity';
import { createLocationClass } from './component/create.com.dto';

@Injectable()
export class LCCOMService {
  constructor(
    @InjectRepository(LCCOM)
    private readonly lccomRepository: Repository<LCCOM>,
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,

  ) {}

  async getLocations(): Promise<LCCOM[]> {
    const locations = await this.lccomRepository.find();
    return locations;
  }

  async createLocation(body: createLocationClass): Promise<boolean> {
    const oldUserData = await this.userRespository.findOne({
      where: {
        id: body.userid,
        password : body.password,
        position : "HR Manager"
      },
    });

    if(!oldUserData || body.password != oldUserData.password){
      throw new Error("You cannot do it");
    } else {
      const newLocation: LCCOM = {
        id: body.id,
        companyname: body.companyname,
        branchname: body.branchname,
        companytag: body.companytag,
        longitude: body.longitude,
        latitude: body.latitude,
        phone: body.phone,
        address: body.address,
       };
       await this.lccomRepository.save(newLocation);
       return true;
    }
  }

  async configureLocation(id: string, body: updateComClass): Promise<boolean> {
    const oldUserData = await this.userRespository.findOne({
      where: {
        id: body.userid,
        password : body.password,
        position : "HR Manager"
      },
    });

    if(!oldUserData || body.password != oldUserData.password){
      throw new Error("You cannot do it");
    } else {
      const currentLocation = await this.lccomRepository.findOne({
        where: {
          id : id,
          companytag : body.companytag
        }
      });
      if(currentLocation){
        // Update LatLng
        if(body.latitude && body.longitude){
          currentLocation.latitude = body.latitude;
          currentLocation.longitude =  body.longitude;
          await this.lccomRepository.save(currentLocation);
          return true;
        }
        // Update BranchName
        if(body.branchname){
          currentLocation.branchname = body.branchname;
          await this.lccomRepository.save(currentLocation);
          return true;
        }
         // Update Address
         if(body.address){
          currentLocation.address = body.address;
          await this.lccomRepository.save(currentLocation);
          return true;
        }
         // Update Phone
         if(body.phone){
          currentLocation.phone = body.phone;
          await this.lccomRepository.save(currentLocation);
          return true;
        }
      }
    }
}

async deleteLocation( body: updateComClass): Promise<boolean> {
  const oldUserData = await this.userRespository.findOne({
    where: {
      id: body.userid,
      password : body.password,
      position : "HR Manager",
      companytag : body.companytag,
    },
  });

  if(!oldUserData || body.password != oldUserData.password){
    throw new Error("You cannot do it");
  } else {
    const currentLocation = await this.lccomRepository.findOne({
      where: {
        id : body.id,
        companytag : body.companytag
      }
    })
    await this.lccomRepository.remove(currentLocation)
    return true
  }
}
}