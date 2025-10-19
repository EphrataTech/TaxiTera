import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    try {
      return await this.userModel.findOne({ email }).exec();
    } catch (error) {
      this.logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  async findById(id: string) {
    try {
      const user = await this.userModel.findById(id).exec();
      if (!user) throw new NotFoundException('User not found');
      return user;
    } catch (error) {
      this.logger.error(`Error finding user by ID: ${error.message}`);
      throw error;
    }
  }

  async createUser(name: string, email: string, password: string, phone?: string) {
    try {
      this.logger.log(`Creating user: ${email}`);
      
      const hash = await bcrypt.hash(password, 10);
      const userData = { 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password: hash 
      };
      
      if (phone) {
        userData['phone'] = phone.trim();
      }
      
      const user = new this.userModel(userData);
      const savedUser = await user.save();
      
      this.logger.log(`User created successfully: ${savedUser.id}`);
      return savedUser;
    } catch (error) {
      this.logger.error(`Error creating user: ${error.message}`, error.stack);
      throw error;
    }
  }

  async validatePassword(user: UserDocument, password: string) {
    try {
      return await bcrypt.compare(password, user.password);
    } catch (error) {
      this.logger.error(`Error validating password: ${error.message}`);
      throw error;
    }
  }
}