class ResponseModel {
  message: {
    messageCode: string
  };

  data: {};

  constructor() {
    this.message = {
      messageCode: "SUCCESS"
    };
    this.data = {};
  }

  Success(data = {}) {
    this.data = data;
    return this;
  }

  Failed(messageObject: {
    message: string,
    messageCode: string
  }) {
    this.message = messageObject;
    return this;
  }
}

export default ResponseModel;
