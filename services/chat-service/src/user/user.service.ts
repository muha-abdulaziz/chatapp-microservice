import {Inject, Injectable} from '@nestjs/common';
import {Collection, Db, Logger, ObjectId} from 'mongodb';
import {User} from './models/user.model';

@Injectable()
export class UserService {
  readonly logger = new Logger(UserService.name);
  private userCollection: Collection;
  constructor(
    @Inject('MONGODB_CONNECTION')
    private db: Db,
  ) {
    // [TODO] add collection names in enum
    this.userCollection = this.db.collection('users');
  }

  async insertOne(user: User): Promise<void> {
    this.logger.debug('Creating a user...');
    await this.userCollection.insertOne(user);
  }

  async findById(id: string): Promise<User | null> {
    this.logger.debug('Getting a user by email...');
    return this.userCollection.findOne<User>({_id: id});
  }

  async findByEmail(email: string): Promise<User | null> {
    this.logger.debug('Getting a user by email...');
    return this.userCollection.findOne<User>({email});
  }

  async updateOne(
    id: string | ObjectId,
    user: Partial<Omit<User, '_id'>>,
  ): Promise<void> {
    this.logger.debug('Updating a user...');
    await this.userCollection.updateOne({_id: id}, {$set: user});
  }
}
