import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { Response } from 'express';

@Controller('api/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /api/users
  // Create a new user in the database
  @Post()
  async createUser(@Body() createUserDto: UserDto, @Res() res: Response) {
    try {
      const createdUser = await this.userService.createUser(createUserDto);
      return res.status(HttpStatus.CREATED).json({
        message: 'User created successfully',
        user: createdUser,
      });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Error creating user',
        error: error.message,
      });
    }
  }

  // GET /api/user/:userId
  // Fetch a user by ID from the ReqRes API
  @Get(':userId')
  async getUser(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const user = await this.userService.getUser(userId);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'User not found',
        error: error.message,
      });
    }
  }

  // GET /api/user/:userId/avatar
  // Fetch a user's avatar and return it as a base64-encoded string
  @Get(':userId/avatar')
  async getUserAvatar(@Param('userId') userId: string, @Res() res: Response) {
    try {
      const avatarBase64 = await this.userService.getUserAvatar(userId);
      return res.status(HttpStatus.OK).json({
        userId: userId,
        avatar: avatarBase64,
      });
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Avatar not found',
        error: error.message,
      });
    }
  }

  // DELETE /api/user/:userId/avatar
  // Delete a user's avatar from the file system and the database
  @Delete(':userId/avatar')
  async deleteUserAvatar(@Param('userId') userId: string, @Res() res: Response) {
    try {
      await this.userService.deleteUserAvatar(userId);
      return res.status(HttpStatus.NO_CONTENT).send();
    } catch (error) {
      return res.status(HttpStatus.NOT_FOUND).json({
        message: 'Avatar not found or already deleted',
        error: error.message,
      });
    }
  }
}
