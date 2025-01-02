import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from './entities/state.entity';
import { District } from './entities/district.entity';

@Injectable()
export class LocationService {
  constructor(
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) { }

  async createState(name: string): Promise<State> {
    const existingState = await this.stateRepository.findOne({
      where: { name },
    });

    if (existingState) {
      throw new ConflictException('State already exists');
    }

    const state = this.stateRepository.create({ name });
    return await this.stateRepository.save(state);
  }

  async createDistrict(stateId: number, name: string): Promise<District> {
    const state = await this.stateRepository.findOne({
      where: { id: stateId },
    });

    if (!state) {
      throw new NotFoundException('State not found');
    }

    const existingDistrict = await this.districtRepository.findOne({
      where: { name, state: { id: stateId } },
    });

    if (existingDistrict) {
      throw new ConflictException('District already exists in this state');
    }

    const district = this.districtRepository.create({ name, state });
    return await this.districtRepository.save(district);
  }

  async getAllStates(): Promise<State[]> {
    return await this.stateRepository.find();
  }

  async getDistrictsByState(stateId: number): Promise<District[]> {
    return await this.districtRepository.find({
      where: { state: { id: stateId } },
      relations: ['state'],
    });
  }

  async findStateById(id: number): Promise<State> {
    const state = await this.stateRepository.findOne({ where: { id } });
    if (!state) {
      throw new NotFoundException('State not found');
    }
    return state;
  }

  async findDistrictById(id: number): Promise<District> {
    const district = await this.districtRepository.findOne({
      where: { id },
      relations: ['state'],
    });
    if (!district) {
      throw new NotFoundException('District not found');
    }
    return district;
  }
}
