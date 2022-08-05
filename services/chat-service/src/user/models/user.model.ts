import {ObjectId} from 'mongodb';

export class User {
  _id: ObjectId;

  email: string;

  createdAt: string;

  updatedAt: string;

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}
