import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {


  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email: email.toLowerCase().trim() }).exec();
  }

  async findByPhone(phone: string) {
    return await this.userModel.findOne({ phone: phone.trim() }).exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(name: string, email: string, password: string, phone?: string) {
    if (phone) {
      const existingPhone = await this.findByPhone(phone);
      if (existingPhone) {
        throw new ConflictException('Phone number already in use');
      }
    }
    
    const hash = await bcrypt.hash(password, 12);
    const userData = { 
      name: name.trim(), 
      email: email.toLowerCase().trim(), 
      password: hash,
      isEmailVerified: false,
      isActive: true
    };
    
    if (phone) {
      userData['phone'] = phone.trim();
    }
    
    try {
      const user = new this.userModel(userData);
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new ConflictException(`${field} already exists`);
      }
      throw error;
    }
  }

  async validatePassword(user: UserDocument, password: string) {
    return await bcrypt.compare(password, user.password);
  }

  async findByVerificationToken(token: string) {
    return await this.userModel.findOne({ emailVerificationToken: token }).exec();
  }

  async markEmailAsVerified(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { 
        isEmailVerified: true, 
        emailVerificationToken: undefined 
      },
      { new: true }
    ).exec();
  }

  async setVerificationToken(userId: string, token: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { emailVerificationToken: token },
      { new: true }
    ).exec();
  }

  async setPasswordResetToken(userId: string, token: string, expires: Date) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { 
        passwordResetToken: token,
        passwordResetExpires: expires
      },
      { new: true }
    ).exec();
  }

  async findByPasswordResetToken(token: string) {
    return await this.userModel.findOne({ passwordResetToken: token }).exec();
  }

  async updatePassword(userId: string, newPassword: string) {
    const hash = await bcrypt.hash(newPassword, 12);
    return await this.userModel.findByIdAndUpdate(
      userId,
      { password: hash },
      { new: true }
    ).exec();
  }

  async clearPasswordResetToken(userId: string) {
    return await this.userModel.findByIdAndUpdate(
      userId,
      { 
        passwordResetToken: undefined,
        passwordResetExpires: undefined
      },
      { new: true }
    ).exec();
  }

  async updateProfile(userId: string, updateData: { name?: string; phone?: string; profilePicture?: string }) {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select('-password').exec();
    
    if (!user) throw new NotFoundException('User not found');
    return { user, message: 'Profile updated successfully' };
  }
}