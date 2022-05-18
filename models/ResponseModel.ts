class ResponseModel {
  message: {
    messageCode: string;
  };

  data: {};

  statusCode : number;

  constructor() {
    this.message = {
      messageCode: 'SUCCESS',
    };
    this.data = {};
    this.statusCode = 200;
  }

  Success(data = {}) {
    this.data = data;
    return this;
  }

  Failed(messageObject: { message: string; messageCode: string }, statusCode : number) {
    this.statusCode = statusCode;
    this.message = messageObject;
    return this;
  }
}

export default ResponseModel;
