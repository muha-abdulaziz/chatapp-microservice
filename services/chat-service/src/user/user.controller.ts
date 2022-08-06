import {Controller} from '@nestjs/common';
import {EventPattern} from '@nestjs/microservices';
import {Logger} from 'mongodb';
import {MsgBusTopics} from 'src/msg-bus/enums/msg-bus-topics.enum';
import {User} from './models/user.model';
import {UserService} from './user.service';

@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private readonly userService: UserService) {}

  @EventPattern(MsgBusTopics.USER_CREATED)
  async createUser(user: User) {
    const existingUser = await this.userService.findByEmail(user.email);

    if (existingUser) return;

    this.logger.debug('creating a user...');
    await this.userService.insertOne(user);
    this.logger.debug('a new user have been created.');
    return;
  }
}
