import {ObjectId} from 'mongodb';

export class MessageModel {
  _id: ObjectId;

  sender: {id: string; name?: string; email?: string};

  sentAt: string;

  msgBody: string;

  constructor(data: Partial<MessageModel>) {
    Object.assign(this, data);
  }
}
