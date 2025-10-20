import { Controller, Get, Put, Post, UseGuards, Req, Body, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { existsSync, mkdirSync } from 'fs';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: any) {
    return { user: req.user, message: 'Auth working!' };
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  updateProfile(@Req() req: any, @Body() body: { name?: string; phone?: string }) {
    return this.usersService.updateProfile(req.user.userId, body);
  }

  @Post('profile/upload')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('profilePicture', {
    storage: diskStorage({
      destination: './uploads/profiles',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `profile-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'), false);
      }
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }))
  uploadProfilePicture(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body() body: { name?: string; phone?: string }
  ) {
    const profilePictureUrl = `/uploads/profiles/${file.filename}`;
    return this.usersService.updateProfile(req.user.userId, {
      ...body,
      profilePicture: profilePictureUrl
    });
  }
}