"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ResponseModel {
    constructor() {
        this.message = {
            messageCode: 'SUCCESS',
        };
        this.data = {};
    }
    Success(data = {}) {
        this.data = data;
        return this;
    }
    Failed(messageObject) {
        this.message = messageObject;
        return this;
    }
}
exports.default = ResponseModel;
//# sourceMappingURL=ResponseModel.js.map