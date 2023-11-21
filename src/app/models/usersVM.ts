export class UserVM implements IUserVM {
  userId?: number;
  userName?: string;
  password?: string;
  image?: string;
  constructor(data?: UserVM) {
    if (data) {
      for (var property in data) {
        if (data.hasOwnProperty(property))
          (<any>this)[property] = (<any>data)[property];
      }
    }
  }

  init(_data?: any) {
    if (_data) {
      this.userId = _data['userId'];
      this.userName = _data['userName'];
      this.password = _data['password'];
      this.image = _data['image'];
    }
  }

  static fromJS(data: any): UserVM {
    data = typeof data === 'object' ? data : {};
    let result = new UserVM();
    result.init(data);
    return result;
  }
  toJSON(data?: any) {
    data = typeof data === 'object' ? data : {};
    data['password'] = this.password;
    data['image'] = this.image;
    data['userId'] = this.userId;
    data['userName'] = this.userName;
    return data;
  }
}

export interface IUserVM {
  userId?: number;
  userName?: string;
  password?: string;
  image?: string;
}