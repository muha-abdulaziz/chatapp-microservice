import {ObjectId} from 'mongodb';

export class ResetTokenModel {
  _id: ObjectId;

  email: string;

  token: string;

  expiry: string;

  createdAt: string;

  updatedAt: string;

  constructor(data: Partial<ResetTokenModel>) {
    this._id = data._id;
    this.email = data.email;
    this.token = data.token;
    this.expiry = data.expiry;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}
