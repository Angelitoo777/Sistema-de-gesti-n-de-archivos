import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, ConflictException } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { UsersRepository } from '../users.repository';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private usersRepository: UsersRepository) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    const userExists = await this.usersRepository.userExists(email);

    if (!userExists) {
      throw new ConflictException('Credenciales invalidas');
    }

    const comparePassword = await bcrypt.compare(password, userExists.password);

    if (!comparePassword) {
      throw new ConflictException('Credenciales invalidas');
    }

    return {
      id: userExists.id,
      email: userExists.email,
    };
  }
}
