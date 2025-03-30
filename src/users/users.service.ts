import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepo.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (user) {
      throw new ForbiddenException('Уже есть');
    }

    const hashPassword = await bcrypt.hash(createUserDto.password, 7);
    const newUser = this.userRepo.create({
      ...createUserDto,
      password: hashPassword,
    });

    const { password, ...result } = await this.userRepo.save(newUser);

    return result;
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findOne(username: string) {
    return this.userRepo.findOne({
      where: [{ username }, { email: username }],
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
