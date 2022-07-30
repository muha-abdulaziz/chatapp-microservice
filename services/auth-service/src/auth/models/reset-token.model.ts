import {ObjectId} from 'mongodb';

export class ResetTokenModel {
  _id: ObjectId;

  email: string;

  token: string;

  expiry: string;

  createdAt: string;

  updatedAt: string;

  constructor(data: Partial<ResetTokenModel>) {
    Object.assign(this, data);
  }
}
