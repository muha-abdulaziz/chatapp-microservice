import {Exclude} from 'class-transformer';
import {ObjectId} from 'mongodb';

export class User {
  _id: ObjectId;

  email: string;

  @Exclude()
  password: string;

  createdAt: string;

  updatedAt: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
