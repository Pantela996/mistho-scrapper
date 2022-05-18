"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseModel {
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
    Failed(messageObject, statusCode) {
        this.statusCode = statusCode;
        this.message = messageObject;
        return this;
    }
}
exports.default = ResponseModel;
//# sourceMappingURL=ResponseModel.js.map