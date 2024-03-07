import { randomUUID } from 'crypto';
import {
  SingUpDto,
  UpdatePasswordDto,
  UpdateUserByAdminDto,
} from './../dtos/user.dto';
import { UserService } from './../services/user.service';
import { RadarAuthService } from './../services/radar-auth.service';
import { CreateRadarDto } from './../../radar/dtos/radar.dtos';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  UseGuards,
  Post,
  Req,
  Body,
  Param,
  Put,
  Get,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AcceptUser, IsPublic } from '../decorators/user.decorator';
import { MongoIdPipe } from 'src/common/mongo-id/mongo-id.pipe';

@Controller('auth')
export class AuthController {
  private key = randomUUID();
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private radarAuthService: RadarAuthService,
  ) {
    console.log('key:', this.key);
  }

  @AcceptUser('admin')
  @Get()
  async findUsers() {
    const users = await this.userService.findAll();
    return users.map(({ password, ...rest }) => rest);
  }

  @IsPublic()
  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Req() req) {
    const { _id, fullName, roles } = req.user;
    const access_token = await this.jwtService.signAsync({
      id: _id,
      roles,
    });
    return {
      access_token,
      fullName,
      roles,
    };
  }

  @AcceptUser('admin', 'developer', 'employer')
  @Put()
  async updateAccessToken(@Req() req) {
    const { id, roles } = req.user;
    const access_token = await this.jwtService.signAsync({
      id,
      roles,
    });
    const { fullName } = await this.userService.findById(id);
    return {
      access_token,
      fullName,
      roles,
    };
  }

  @IsPublic()
  @Post('/first/:key')
  async createAdmin(@Body() payload: SingUpDto, @Param('key') key: string) {
    const users = await this.userService.count();
    if (key === this.key && users === 0) {
      return this.userService.add({
        ...payload,
        roles: ['admin'],
      });
    }
  }

  @IsPublic()
  @Post('/signup')
  signUp(@Body() payload: SingUpDto) {
    return this.userService.add(payload);
  }

  @AcceptUser('admin', 'developer', 'employer')
  @Put('update-password')
  async updatePassword(@Req() req, @Body() payload: UpdatePasswordDto) {
    const { id } = req.user;
    return this.userService.updatePassword(id, payload);
  }

  @AcceptUser('admin')
  @Get('/radars')
  async findAcessToken() {
    return this.radarAuthService.findAll(true);
  }

  @AcceptUser('admin', 'developer')
  @Post('/radars/new')
  createRadar(@Body() payload: CreateRadarDto) {
    return this.radarAuthService.create(payload);
  }

  @AcceptUser('admin')
  @Put('/admin/:userId')
  updateUser(
    @Param('userId', MongoIdPipe) id: string,
    @Body() payload: UpdateUserByAdminDto,
  ) {
    return this.userService.updateUserById(id, payload);
  }
}
