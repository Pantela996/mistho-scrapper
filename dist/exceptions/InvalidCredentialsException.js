"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class InvalidCredentialsException extends Error {
    constructor(message) {
        super(message);
        Object.setPrototypeOf(this, InvalidCredentialsException.prototype);
    }
}
exports.default = InvalidCredentialsException;
//# sourceMappingURL=InvalidCredentialsException.js.map