import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Feedback } from './feedback.schema';

@Injectable()
export class FeedbackService {
  constructor(@InjectModel(Feedback.name) private feedbackModel: Model<Feedback>) {}

  async createFeedback(feedbackData: any): Promise<Feedback> {
    const feedback = new this.feedbackModel(feedbackData);
    return feedback.save();
  }

  async getAllFeedback(): Promise<Feedback[]> {
    return this.feedbackModel.find().sort({ createdAt: -1 }).exec();
  }
}