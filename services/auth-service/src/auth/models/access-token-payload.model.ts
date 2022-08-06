export class AccessTokenPayLoad {
  _id: string;

  constructor(data: Partial<AccessTokenPayLoad>) {
    Object.assign(this, data);
  }
}
