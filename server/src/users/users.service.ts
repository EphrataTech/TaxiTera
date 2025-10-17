import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(name: string, email: string, password: string, phone?: string) {
    const hash = await bcrypt.hash(password, 10);
    const user = new this.userModel({ name, email, password: hash, phone });
    return user.save();
  }

  async validatePassword(user: UserDocument, password: string) {
    return bcrypt.compare(password, user.password);
  }
}
