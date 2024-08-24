import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.model';
import { RabbitMQService } from './rabbitmq.service';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { UserDto } from './dto/create-user.dto';

@Injectable()
export class UserService implements OnModuleDestroy {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly rabbitMQService: RabbitMQService
  ) {}

  async createUser(createUserDto: UserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    await createdUser.save();

    // Publish an event to RabbitMQ
    const queue = 'user_events';
    const message = JSON.stringify({ event: 'UserCreated', data: createdUser });
    await this.rabbitMQService.publish(queue, message);

    return createdUser;
  }

  async getUser(userId: string): Promise<UserDto> {
    const response = await axios.get(`https://reqres.in/api/users/${userId}`);
    const userData = response.data.data;

    const userDto: UserDto = {
      uid: userData.id,
      email: userData.email,
      first_name: userData.first_name,
      last_name: userData.last_name,
      avatar: userData.avatar,
    };

    return userDto;
  }

  // Fetch and store the user's avatar image, returning a base64-encoded representation
  async getUserAvatar(userId: string): Promise<string> {
    const user = await this.userModel.findOne({ uid: userId }).exec();
    if (!user || !user.avatar) {
      throw new Error('User or avatar not found');
    }

    // Define the uploads directory and the file path
    const uploadsDir = path.resolve(__dirname, '../../uploads');
    const avatarPath = path.join(uploadsDir, `${userId}.jpg`);
    // Ensure the uploads directory exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // If the avatar image already exists, return it in base64 format
    if (fs.existsSync(avatarPath)) {
      const imageBuffer = fs.readFileSync(avatarPath);
      return imageBuffer.toString('base64');
    } else {
      // Fetch the avatar from the ReqRes API and save it
      const response = await axios.get(user.avatar, { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary');
      fs.writeFileSync(avatarPath, imageBuffer);

      // Store the image hash in the database (for future retrieval)
      const imageHash = crypto.createHash('md5').update(imageBuffer).digest('hex');
      await this.userModel.updateOne({ uid: userId }, { $set: { avatarHash: imageHash } });
      return imageBuffer.toString('base64');
    }
  }

  // Delete the user's avatar from the file system and the database
  async deleteUserAvatar(userId: string): Promise<void> {
    const user = await this.userModel.findOne({ uid: userId }).exec();
    if (!user || !user.avatar) {
      throw new Error('User or avatar not found');
    }

    const avatarPath = path.resolve(__dirname, '../../uploads', `${userId}.jpg`);
    if (fs.existsSync(avatarPath)) {
      fs.unlinkSync(avatarPath);
    }

    // Remove the avatar entry from the database
    await this.userModel.updateOne({ uid: userId }, { $unset: { avatar: 1, avatarHash: 1 } });
  }

  async onModuleDestroy() {
    await this.rabbitMQService.close();
  }
}
