"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ResponseModel = require("../models/ResponseModel");
class RequestValidator {
    checkParams(req, res, next) {
        if (!req.body.username || !req.body.password)
            return res.json(new ResponseModel().Failed('Invalid query params'));
        next();
    }
}
exports.default = new RequestValidator();
//# sourceMappingURL=RequestValidator.js.map