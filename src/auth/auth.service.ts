import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(user: any) {
    const { email, name, id } = user;
    const payload = { email, sub: id };
    const accessToken = this.jwtService.sign(payload);

    let dbUser = await this.findUserByEmail(email);
    if (!dbUser) {
      dbUser = await this.createUser({
        email,
        name,
      });
    }

    return {
      access_token: accessToken,
      user: dbUser,
    };
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(user: Partial<User>): Promise<User> {
    if (!user.email) {
      throw new Error('User must have an email');
    }

    const existingUser = await this.findUserByEmail(user.email);
    if (existingUser) {
      return existingUser;
    }

    return this.userRepository.save(user);
  }
}
