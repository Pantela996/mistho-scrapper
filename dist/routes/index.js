"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const RequestValidator_1 = __importDefault(require("../helpers/RequestValidator"));
const ScrappingService_1 = __importDefault(require("../services/ScrappingService"));
router.post('/', [RequestValidator_1.default.checkParams], async (req, res, next) => {
    let response = await ScrappingService_1.default.ScrapeUserData(req.body);
    res.status(200);
    res.send(response);
});
exports.default = router;
//# sourceMappingURL=index.js.map