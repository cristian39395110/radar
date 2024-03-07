import {
  LoginDto,
  SingUpDto,
  UpdatePasswordDto,
  UpdateUserByAdminDto,
} from './../dtos/user.dto';
import { User, UserModel } from './../entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ForbiddenException, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { Role } from '../decorators/user.decorator';

@Injectable()
export class UserService {
  private SALT = 16;

  constructor(@InjectModel(User.name) private userModel: UserModel) {}

  async findAll() {
    const users = await this.userModel.find().exec();
    return users
      .map((user) => user.toJSON())
      .map(({ password, ...rest }) => rest);
  }

  async findById(id: string) {
    return this.userModel.findById(id).exec();
  }

  async add(payload: SingUpDto) {
    const password = bcrypt.hashSync(payload.password, this.SALT);
    const { username } = payload;
    const user = new this.userModel({
      ...payload,
      password,
      username: username.toLowerCase(),
    });
    const { _id } = await user.save();
    return { id: _id, username: user.username };
  }

  async count() {
    return this.userModel.countDocuments().exec();
  }

  async validate(payload: LoginDto) {
    const user = await this.userModel
      .findOne({ username: payload.username.toLowerCase() })
      .exec();
    if (!user) {
      return null;
    }
    const match = bcrypt.compareSync(payload.password, user.password);
    const { password, ...rest } = user.toJSON();
    return match ? rest : null;
  }

  async updatePassword(id: string, payload: UpdatePasswordDto) {
    const { password } = await this.userModel.findById(id);
    const result = await bcrypt.compare(payload.oldPassword, password);
    if (!result) {
      throw new ForbiddenException('La contraseña actual no coincide');
    }

    const encryptedPassword = bcrypt.hashSync(payload.password, this.SALT);
    await this.userModel.findByIdAndUpdate(id, {
      password: encryptedPassword,
    });

    return { message: 'Contraseña actualizada con exito' };
  }

  async updateUserById(id: string, { role, password }: UpdateUserByAdminDto) {
    let encryptedPassword;
    if (password) {
      encryptedPassword = await bcrypt.hash(password, this.SALT);
    }
    return this.userModel.findByIdAndUpdate(id, {
      roles: [role],
      password: encryptedPassword,
    });
  }
}
