import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoType } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { ZodValidationPipe } from './pipes/user.pipes';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthenticatedRequest } from './dto/token.dto';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';

@Controller('/auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @UsePipes(new ZodValidationPipe(CreateUserDto))
  register(@Body() data: CreateUserDtoType) {
    return this.usersService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @UsePipes(new ZodValidationPipe(LoginDto))
  login(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user;

    const access_token = this.usersService.createToken(user);

    res.cookie('access_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600000, // 1 hour
    });

    return {
      message: 'Login exitoso',
      user: user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    return {
      message: 'Logout exitoso',
    };
  }
  @UseGuards(JwtAuthGuard)
  @Get('/users')
  findAll() {
    return this.usersService.findAll();
  }
}
