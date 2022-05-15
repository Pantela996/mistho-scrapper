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

  Failed(message: {
    messageCode: string
  }) {
    this.message = message;
    return this;
  }
}

export default new ResponseModel();
