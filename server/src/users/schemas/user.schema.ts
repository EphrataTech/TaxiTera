import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

/**
 * User entity representing registered users in the system
 */
@Schema({ timestamps: true })
export class User {
  /** User's full name */
  @Prop({ required: true, trim: true })
  name: string;

  /** User's email address (unique identifier) */
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  /** User's phone number (optional, unique if provided) */
  @Prop({ unique: true, sparse: true, trim: true })
  phone?: string;

  /** Hashed password */
  @Prop({ required: true })
  password: string;

  /** Email verification status */
  @Prop({ default: false })
  isEmailVerified: boolean;

  /** Account active status */
  @Prop({ default: true })
  isActive: boolean;

  /** Token for email verification */
  @Prop()
  emailVerificationToken?: string;

  /** Token for password reset */
  @Prop()
  passwordResetToken?: string;

  /** Password reset token expiration */
  @Prop()
  passwordResetExpires?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Add indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ phone: 1 });
UserSchema.index({ emailVerificationToken: 1 });
UserSchema.index({ passwordResetToken: 1 });