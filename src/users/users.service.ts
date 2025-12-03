import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import { UsersRepository } from './users.repository';
import bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { TokenDto } from './dto/token.dto';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(data: Prisma.UserCreateInput) {
    const userExists = await this.usersRepository.userExists(data.email);

    if (userExists) {
      return new ConflictException('Usuario ya existe.');
    }

    const hasshedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await this.usersRepository.register({
      ...data,
      password: hasshedPassword,
    });

    return newUser;
  }

  createToken(user: TokenDto) {
    const payload = {
      sub: user.id,
      email: user.email,
    };
    return this.jwtService.sign(payload);
  }

  findAll() {
    return this.usersRepository.findAll();
  }
}
