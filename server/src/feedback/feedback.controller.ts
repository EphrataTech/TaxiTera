import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private feedbackService: FeedbackService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createFeedback(@Req() req, @Body() feedbackData: any) {
    return this.feedbackService.createFeedback({
      ...feedbackData,
      userId: req.user.userId,
      userName: req.user.name,
    });
  }

  @Get()
  async getAllFeedback() {
    return this.feedbackService.getAllFeedback();
  }
}